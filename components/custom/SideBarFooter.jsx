import { LogOut } from 'lucide-react'
import React, { useContext } from 'react'
import { Button } from '../ui/button'
import { UserDetailContext } from '@/context/UserDetailContext'

const SideBarFooter = () => {
    const { handleLogout } = useContext(UserDetailContext)

    const options = [
        {
            name : "Sign Out",
            icon: LogOut,
            action: handleLogout
        }
    ]
  return (
    <div className='mb-10'>
            {options.map((option,index) => (
               <Button key={index} className={" "} onClick={option.action}>
                <option.icon />
                {option.name}
               </Button>
            ) )}
    </div>
  )
}

export default SideBarFooter
