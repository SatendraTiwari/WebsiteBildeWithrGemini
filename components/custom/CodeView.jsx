"use client"
import React, { useContext, useEffect, useState } from 'react'
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import Lookup from '@/data/Lookup';
import { MessagesContext } from '@/context/MessagesContext';
import axios from 'axios';
import Prompt from '@/data/Prompt';
import { useConvex, useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { Loader2Icon } from 'lucide-react';

const CodeView = () => {
  const {id} = useParams();
  const [activeTab,setActiveTab] = useState('code');

  const [files,setFiles] = useState(Lookup.DEFAULT_FILE);
  const {messages = [], setMessages} = useContext(MessagesContext)
  const UpdateFiles = useMutation(api.workspace.UpdateFiles)

  const convex = useConvex();

  const [loading,setLoading] = useState(false);

  useEffect(() => {
    id && GetFiles();
  },[id])

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace,{
      workspaceId : id
    });

    const mergeFiles = {...Lookup.DEFAULT_FILE,...result?.fileData};
    setFiles(mergeFiles);
    setLoading(false)
  }


  useEffect(() => {
      if (Array.isArray(messages) && messages.length > 0) {
        const role = messages[messages?.length - 1].role;
  
        if (role == 'user') {
          GenerateCode();
        }
      }
    }, [messages])

  const GenerateCode = async () => {
    setLoading(true);
    const PROMPT = messages[messages?.length - 1]?.content +" " + Prompt.CODE_GEN_PROMPT;
    const result = await axios.post(`/api/gen-ai-code`, {
      prompt: PROMPT,
    })

    console.log(result.data);
    const aiResp = result.data;
    const mergeFiles = {...Lookup.DEFAULT_FILE,...aiResp?.files};

    setFiles(mergeFiles);
    await UpdateFiles({
      workspaceId: id,
      fileData : aiResp.files
    }); 


    setLoading(false);
  }


  return (
    <div className=' relative'>
      <div className='bg-[#181818] w-full p-2 border'>
        <div className='flex items-center flex-wrap shrink-0 bg-black p-1 justify-center w-[150px] gap-4 rounded-full'>
          <h2 
          onClick={() => setActiveTab('code')}
          className={`text-sm cursor-pointer ${activeTab === 'code' && 'text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full '}`}>Code</h2>
          <h2
          onClick={() => setActiveTab('preview')} 
          className={`text-sm cursor-pointer ${activeTab === 'preview' && 'text-blue-500 bg-blue-500/25 p-1 px-2 rounded-full'}`}>Preview</h2>
        </div>
      </div>
      <SandpackProvider 
      files={files}
      template="react" theme={'dark'}
      customSetup={{
        dependencies: {
          ...Lookup.DEPENDANCY
        }
      }}
      options={{
        externalResources:['https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4']
      }}
      >
        <SandpackLayout>
        { activeTab == 'code' ? (
          <>
          <SandpackFileExplorer style={{height : '84vh'}}/>
          <SandpackCodeEditor style={{height : '84vh'}} />
          </>
          ) : (
          <SandpackPreview  style={{height : '84vh'}}/>)}
        </SandpackLayout>
      </SandpackProvider>

      {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
        <Loader2Icon className=' animate-spin h-10 w-10 text-white' />
        <h2 className=' text-white'>Generatig your files...</h2>
      </div>}
    </div>
  )
}

export default CodeView