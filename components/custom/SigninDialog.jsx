import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "../ui/button";
import { useGoogleLogin } from "@react-oauth/google";
import { UserDetailContext } from "@/context/UserDetailContext";
import axios from "axios";
import { useConvex, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";

const GUEST_USER = {
  name: "Guest User",
  email: "guest@createfy.local",
  picture: "https://archive.org/download/placeholder-image/placeholder-image.jpg",
};

const SigninDialog = ({ openDialog, closeDialog }) => {
  const { setUserDetail } = useContext(UserDetailContext);
  const [authError, setAuthError] = useState("");

  const convex = useConvex();
  const createUser = useMutation(api.users.CreateUser);

  const persistUser = async (user) => {
    await createUser({
      name: user?.name,
      email: user?.email,
      picture: user?.picture,
      uid: uuid4(),
    });

    const dbUser = await convex.query(api.users.GetUser, {
      email: user?.email,
    });

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "userDetail",
        JSON.stringify({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
        })
      );
    }

    setUserDetail(dbUser || user);
    closeDialog(false);
  };

  const googleLogin = useGoogleLogin({
    flow: "implicit",
    scope: "openid profile email",
    onSuccess: async (tokenResponse) => {
      try {
        setAuthError("");
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: "Bearer " + tokenResponse?.access_token } }
        );

        await persistUser(userInfo?.data);
      } catch (error) {
        const msg = error?.message || "Unable to complete Google sign-in.";
        setAuthError(msg);
        console.error("Google login post-auth failed:", error);
      }
    },
    onError: (errorResponse) => {
      const code = errorResponse?.error || "oauth_error";
      setAuthError(`Google sign-in failed: ${code}.`);
      console.error("Google OAuth error:", errorResponse);
    },
    onNonOAuthError: (error) => {
      const code = error?.type || "non_oauth_error";
      setAuthError(`Google sign-in failed: ${code}.`);
      console.error("Google non-OAuth error:", error);
    },
  });

  const continueAsGuest = async () => {
    try {
      setAuthError("");
      await persistUser(GUEST_USER);
    } catch (error) {
      const msg = error?.message || "Unable to continue as guest.";
      setAuthError(msg);
      console.error("Guest sign-in failed:", error);
    }
  };

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader className={"flex flex-col justify-center gap-3 items-center"}>
          <DialogTitle className="font-bold text-2xl text-white">
            {Lookup.SIGNIN_HEADING}
          </DialogTitle>
          <DialogDescription className="mt-2 text-center">
            {Lookup.SIGNIN_SUBHEADING}
          </DialogDescription>
          <DialogDescription>
            <Button
              className={"bg-blue-500 text-white hover:bg-blue-400 mt-3 cursor-pointer"}
              onClick={() => googleLogin()}
            >
              Sign In With Google
            </Button>
          </DialogDescription>
          <DialogDescription>
            <Button
              variant="outline"
              className="mt-1 cursor-pointer"
              onClick={continueAsGuest}
            >
              Continue As Guest
            </Button>
          </DialogDescription>
          {authError && (
            <DialogDescription className="text-red-400 text-xs text-center">
              {authError}
            </DialogDescription>
          )}

          <DialogFooter>{Lookup.SIGNIn_AGREEMENT_TEXT}</DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SigninDialog;

