"use client";

import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "../ui/use-toast";
import { useStore } from "@/lib/store";
import { useLogout } from "@/hooks/auth/useLogout";
import Cookies from 'js-cookie'

interface LogoutModalProps {
  children: React.ReactNode;
}
export default function LogoutModal({ children }: LogoutModalProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { setUser } = useStore();
  const { logout } = useLogout();
  const { toast } = useToast();

  const handleLogout = async () => {
    console.log('logout')
    setUser(null); // clear user from store
    setOpen(false); // close modal
    Cookies.remove('user');
    Cookies.remove('token');
    router.push("/login");
    toast({
      title: "You have been logged out",
      description: "You can now log in again",
      className: "bg-green-500 text-white border-green-600",
      duration: 3000, // 3 seconds
    });

    await logout();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogDescription>
            Are you sure you want to log out? You will need to log in again to access your account.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={async () => {
              setOpen(false);
              await handleLogout();
            }}
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
