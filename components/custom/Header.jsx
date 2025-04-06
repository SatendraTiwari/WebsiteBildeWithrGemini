"use client"
import Image from 'next/image'
import React, { useContext } from 'react'
import logo from "../../public/logo3.png"
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useParams } from 'next/navigation'
const Header = () => {
  const id = useParams()
  console.log("id ::",id);
  const { userDetail, setUserDetail } = useContext(UserDetailContext)
  console.log(userDetail);
  return (
    <div className='p-4 flex justify-between items-center border-b backdrop-blur-md bg-black/10 '>
      <Image src={logo} alt='Logo' width={50} height={50} />

      <div className='flex gap-5'>
        {!userDetail?.name ? (
          <>
            <Button variant={"ghost"}>Sing In</Button>

            <Button variant={"ghost"}
              className={"text-white "}
              style={{
                backgroundColor: Colors.BLUE
              }}>Get Started</Button>
          </>) : (
          <>
            <Button variant={"ghost"}>  Export</Button>

            <Button variant={"ghost"}
              className={"text-white "}
              style={{
                backgroundColor: Colors.BLUE,
              }}> Deploy</Button>
            <div className=''>
              <Image src={`${userDetail?.picture}`} alt={userDetail.name} width={30} height={30} className=' rounded-full' />
            </div>
          </>
        )
        }
      </div>
    </div>
  )
}

export default Header