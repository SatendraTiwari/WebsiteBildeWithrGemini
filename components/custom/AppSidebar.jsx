import React, { useContext, useState } from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    useSidebar,
} from "@/components/ui/sidebar"
import logo from "../../public/logo02.png"
import Image from 'next/image'
import { Button } from '../ui/button'
import { LogOut, MessageCircleCode, SidebarClose } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'
import SideBarFooter from './SidebarFooter'
import { UserDetailContext } from '@/context/UserDetailContext'
import { useRouter } from 'next/navigation'




const AppSidebar = () => {

    const [loading, setLoading] = useState(false)
    const rounter = useRouter()

    const { userDetail, setUserDetail } = useContext(UserDetailContext)

    const { toggleSidebar } = useSidebar()

    const ClickHandler = () => {

        rounter.push('/');
    }

    const { handleLogout } = useContext(UserDetailContext)
    return (
        <div className='fixed z-50 '>
            <Sidebar className={''}>
                <SidebarHeader className={'p-5 flex flex-col'}>
                    <Image src={logo} alt='Logo' width={60} height={60} />
                    <SidebarGroup className={''}>
                    {userDetail && <div
                        className='cursor-pointer hover:border w-8 h-8 hover:bg-gray-700  justify-center items-center flex hover:rounded-md mb-5'
                        onClick={toggleSidebar}

                    >
                        <SidebarClose />
                    </div>}
                    <Button onClick={ClickHandler} className={'mt-6 cursor-pointer'}><MessageCircleCode /> Start New Chat</Button>
                    </SidebarGroup>
                </SidebarHeader>
                <SidebarContent className={'p-5'}>
                    <SidebarGroup>
                        <WorkspaceHistory />
                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter >
                    <Button className={" cursor-pointer "} onClick={handleLogout}>
                        <LogOut />
                        Sign Out
                    </Button>
                </SidebarFooter>
            </Sidebar>

        </div>
    )
}

export default AppSidebar