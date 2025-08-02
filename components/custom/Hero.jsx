"use client"
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import Lookup from '@/data/Lookup'
import { ArrowRight, Link, Loader2Icon } from 'lucide-react'
import React, { useContext, useState } from 'react'
import SigninDialog from './SigninDialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { GlowingEffect } from '../ui/glowing-effect'
import { AnimatedTooltip } from '../ui/animated-tooltip'
import { people } from '@/data/DeveloperData'
import { Spotlight } from '../ui/spotlight-new'
import Loader from './Loader'

const Hero = () => {
  const [userInput, setUserInput] = useState("")
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetail, setUserDetail,openDialog, setOpenDialog } = useContext(UserDetailContext);
  const CreateWorkspace = useMutation(api.workspace.CreateWorkspace);
  const [loading,setLoading]  = useState(false)
  const router = useRouter();

  const onGenerate = async (input) => {
    setLoading(true);
    if (!userDetail?.name) {
      setOpenDialog(true);
    }
    
    const msg = {
      role: "user",
      content: input
    }
    setMessages(msg)

    try {
      const workspaceId = await CreateWorkspace({
        messages: [msg],
        user: userDetail?._id
      });

      if(!workspaceId){
        router.push(`/`);
      }

      setLoading(false);

      router.push(`/workspace/${workspaceId}`);
    } catch (error) {
      console.error('Workspace creation failed:', error);
      // Handle error (show toast/alert to user)
    }
  }


  const onKeyHandler = (e) => {
    if(e.key === "Enter" && userInput){
      onGenerate(userInput);
    }
  }

  return (
    <>
      <div className='flex flex-col items-center mt-36 xl:mt-52 gap-4 '>
        <h2 className='font-bold text-2xl lg:text-4xl'>{Lookup.HERO_HEADING}</h2>
        <p className='text-gray-400 font-medium'>{Lookup.HERO_DESC}</p>

        <div className='p-5 rounded-xl max-w-2xl w-full mt-3 border relative'>
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className='flex gap-3 relative '>
            <textarea 
              onKeyDown={(e) => onKeyHandler(e)}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder={Lookup.INPUT_PLACEHOLDER} className='outline-none bg-transparent w-full h-32 max-h-56 resize-none relative' />
            {userInput && <ArrowRight
              onClick={() => onGenerate(userInput)}
              className='bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer font-bold' />}
          </div>
          <div>
            <Link className='h-5 w-5' />
          </div>
        </div>

        <div className='flex mt-8 flex-wrap max-w-2xl items-center justify-center gap-5'>
          {Lookup.SUGGSTIONS.map((suggestion, index) => (
            <h2 key={index}
              onClick={() => onGenerate(suggestion)}
              className='p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer '
            >{suggestion}</h2>
          ))}
        </div>


        <div className="flex flex-row items-center justify-center mb-10 w-full mt-10">
          <AnimatedTooltip items={people} />
        </div>

        <SigninDialog openDialog={openDialog} closeDialog={(v) => setOpenDialog(v)} />

        {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
        <Loader />
        <h2 className=' text-white'>Generatig your files...</h2>
      </div>}
      </div>
    </>
  )
}

export default Hero