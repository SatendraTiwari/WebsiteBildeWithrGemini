import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import uuid4 from "uuid4";

const SigninDialog = ({ openDialog, closeDialog }) => {

    const { userDetail, setUserDetail } = useContext(UserDetailContext);

    const CreateUser = useMutation(api.users.CreateUser);

    const googleLogin = useGoogleLogin({

        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );

            console.log(userInfo);

            const user = userInfo?.data;
            // save user Detail in Database 

            await CreateUser({
                name: user?.name,
                email: user?.email,
                picture: user?.picture,
                uid: uuid4(),
            })

            if (typeof window !== undefined) {
                localStorage.setItem('userDetail', JSON.stringify(user));
            }

            setUserDetail(userInfo.data);;
            // svae a inside in a database
            
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent>
                <DialogHeader className={'flex flex-col justify-center gap-3 items-center'}>
                    <DialogTitle className='font-bold text-2xl text-white'>{Lookup.SIGNIN_HEADING}</DialogTitle>
                    <DialogDescription className='mt-2 text-center' >
                      {Lookup.SIGNIN_SUBHEADING}
                    </DialogDescription>
                    <DialogDescription>
                            <Button id="radix-«R2" className={'bg-blue-500 text-white hover:bg-blue-400 mt-3 cursor-pointer '}
                                onClick={(e) => googleLogin()}
                            >
                                Sign In With Google
                            </Button>
                    </DialogDescription>

                    <DialogFooter>
                        {Lookup.SIGNIn_AGREEMENT_TEXT}
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default SigninDialog