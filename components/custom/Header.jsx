"use client"
import Image from 'next/image'
import React, { useContext, useState } from 'react'
import logo from "../../public/logo02.png"
import defaultAvatar from "../../public/rehan.png"
import { Button } from '../ui/button'
import Colors from '../../data/Colors'
import { UserDetailContext } from '../../context/UserDetailContext'
import { useParams } from 'next/navigation'
import { useSidebar } from '../ui/sidebar'

const Header = () => {
  const id = useParams()
  const { userDetail, openDialog, setOpenDialog } = useContext(UserDetailContext)
  const [avatarError, setAvatarError] = useState(false)
  const {toggleSidebar} = useSidebar()

  return (
    <div className='p-4 flex justify-between items-center border-b backdrop-blur-md bg-black/10'>
      <Image
      onClick={toggleSidebar}
      src={logo} alt='Logo' width={50} height={50} />

      <div className='flex gap-5 items-center'>
        {!userDetail?.name ? (
          <>
            <Button variant="ghost" onClick={() => setOpenDialog(true)}>Sign In</Button>
            <Button 
              variant="ghost"
              className="text-white"
              style={{ backgroundColor: Colors.BLUE }}
            >
              Get Started
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost">Export</Button>
            <Button 
              variant="ghost"
              className="text-white"
              style={{ backgroundColor: Colors.BLUE }}
            >
              Deploy
            </Button>
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image 
                src={avatarError ? defaultAvatar : userDetail.picture} 
                alt={userDetail.name}
                width={32}
                height={32}
                className="rounded-full"
                onError={() => setAvatarError(true)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Header
