"use client"

import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import Colors from '@/data/Colors';
import Lookup from '@/data/Lookup';
import Prompt from '@/data/Prompt';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon, Sidebar, SidebarOpen } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useSidebar } from '../ui/sidebar';


const ChatView = () => {
  const { id } = useParams();

  const convex = useConvex();

  const { messages = [], setMessages } = useContext(MessagesContext)
  const { userDetail, setUserDetail } = useContext(UserDetailContext)

  const [userInput, setUserInput] = useState("");

  const [loading, setLoading] = useState(false);

  const UpdateMessages = useMutation(api.workspace.UpdateMessages)

  const {toggleSidebar} = useSidebar()

  useEffect(() => {
    id && GetWorkspaceData();
  }, [id])


  const GetWorkspaceData = async () => {
    try {
      if (!id) {
        console.error('Workspace ID is missing');
        return;
      }

      const result = await convex.query(api.workspace.GetWorkspace, {
        workspaceId: id
      });

      setMessages(result?.messages)
    } catch (error) {
      console.error('Failed to fetch workspace:', error);
    }
  }

  useEffect(() => {
    if (Array.isArray(messages) && messages.length > 0) {
      const role = messages[messages?.length - 1].role;

      if (role == 'user') {
        GetAiResponse();
      }
    }
  }, [messages])

  const GetAiResponse = async () => {
    setLoading(true);
    const PROMPT = JSON.stringify(messages) + Prompt.CHAT_PROMPT;

    const result = await axios.post('/api/ai-chat', {
      prompt: PROMPT,
    })

    const AIresp = result?.data.result
    const msg = {
      role: 'ai',
      content: AIresp
    }
    setMessages(prev => [...prev, msg])

    await UpdateMessages({
      messages: [...messages, msg],
      workspaceId: id
    })

    setLoading(false);
    console.log("result : ", AIresp);
  }

  const onGenerate = (input) => {
    setMessages(prev => [...prev, {
      role: 'user',
      content: input
    }])
    setUserInput("");
  }


  const onKeyHandler = (e) => {
    console.log(e);
    if (e.key === "Enter" && userInput) {
      onGenerate(userInput);
    }
  }

  return (
    <div className=' relative h-[85vh] flex flex-col '>
        {userDetail && <div
          className='cursor-pointer hover:border w-8 h-8 hover:bg-gray-700  justify-center items-center flex hover:rounded-md mb-5'
          onClick={toggleSidebar}
          
          >
          <SidebarOpen/>
        </div>}
      <div className='flex-1 overflow-y-scroll '>
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div key={index} className={`p-3 mb-2 rounded-lg flex gap-2 items-start`}
            style={{
              backgroundColor: Colors.CHAT_BACKGROUND
            }}
          >
            {msg.role === 'user' &&
              <Image src={userDetail?.picture} alt='userImage' width={35} height={35} className=' rounded-full' />
            }
            <div className='text-white'>
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}

        {loading &&
          <div className='p-3 rounded-lg mb-2 flex gap-2 items-center' style={{
            backgroundColor: Colors.CHAT_BACKGROUND
          }}>
            <Loader2Icon className=' animate-spin' />
            <p>Genereting Reaponse....</p>
          </div>}
      </div>

      {/* Input Box  */}

      <div className='p-5 rounded-xl max-w-2xl w-full mt-3 border'>
        <div className='flex gap-3 '>
          <textarea
            onKeyDown={(e) => onKeyHandler(e)}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={Lookup.INPUT_PLACEHOLDER} className='outline-none bg-transparent w-full h-32 max-h-56 resize-none' />
          {userInput && <ArrowRight
            onClick={() => onGenerate(userInput)}
            className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer font-bold' />}
        </div>
        <div>
          <Link className='h-5 w-5' />
        </div>
      </div>

    </div>
  )
}

export default ChatView