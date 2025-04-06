import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar"
import logo from "../../public/logo3.png"
import Image from 'next/image'
import { Button } from '../ui/button'
import { MessageCircleCode } from 'lucide-react'
import WorkspaceHistory from './WorkspaceHistory'




const AppSidebar = () => {
    return (
        <div>
            <Sidebar>
                <SidebarHeader className={'p-5'}>
                    <Image src={logo} alt='Logo' width={50} height={50}/>
                </SidebarHeader>
                <SidebarContent className={'p-5'}>
                    <Button><MessageCircleCode/> Start New Chat</Button>
                    <SidebarGroup>
                        <WorkspaceHistory/>
                    </SidebarGroup>
                    <SidebarGroup />
                </SidebarContent>
                <SidebarFooter />
            </Sidebar>

        </div>
    )
}

export default AppSidebar