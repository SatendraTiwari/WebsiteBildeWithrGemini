"use client"
import React, { useEffect, useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/components/custom/Header'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailContext'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Spotlight } from '@/components/ui/spotlight-new'
import { SidebarProvider } from '@/components/ui/sidebar'
import AppSidebar from '@/components/custom/AppSidebar'

const provider = ({ children }) => {
  const [messages, setMessages] = useState();

  const [userDetail, setUserDetail] = useState();

  const [openDialog, setOpenDialog] = useState(false);

  const convex = useConvex()

  useEffect(() => {
    IsAuthenticated()
  }, [])

  const IsAuthenticated = async () => {
    try {
      if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("userDetail"));
        if (user) {
          const result = await convex.query(api.users.GetUser, {
            email: user.email,
          });
          if (!result) {
            console.warn('No user found - redirecting to sign in');
            return null;
          }
          setUserDetail(result);
          return result;
        }
        // Redirect to signin if no user in localStorage
      }
      return null;
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  const handleLogout = async () => {
    try {
      await convex.mutation(api.users.LogoutUser, {
        userId: userDetail?._id,
      });
      localStorage.removeItem("userDetail");
      setUserDetail(null);
        window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  }

  return (
    <div>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID_KEY}>
        <UserDetailContext.Provider value={{ userDetail, setUserDetail, handleLogout, openDialog, setOpenDialog  }}>
          <MessagesContext.Provider value={{ messages, setMessages }}>
            <NextThemesProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              <div className='w-full rounded-md md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden'>
                <Spotlight />
                <Header />
                {children}
              </div>
              </SidebarProvider>
            </NextThemesProvider>
          </MessagesContext.Provider>
        </UserDetailContext.Provider>
      </GoogleOAuthProvider>
    </div>
  )
}

export default provider