"use client"

import AppSidebar from '@/components/custom/AppSidebar'
import ChatView from '@/components/custom/ChatView'
import CodeView from '@/components/custom/CodeView'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'


const Workspace = () => {

  return (
    <div className='p-10'>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />
        <div className='grid grid-cols-1 md:grid-cols-3 gap-7'>
          <ChatView />
          <div className='col-span-2'>
            <CodeView />
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}

export default Workspace