import React, { useRef, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
} from "@/components/shadcn";
import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/hooks/useAccessToken";
import { useUserStore } from "@/stores/useUserStore";

import ChangePasswordModal from "./ChangePasswordModal";
import WithdrawalAccountModal from "./WithdrawalAccountModal";

function Info() {
  const router = useRouter();
  const { resetAccessToken } = useAccessToken();
  const {
    actions: { logout },
  } = useAuthStore();
  const { user } = useUserStore();
  const [avatarSrc, setAvatarSrc] = useState("/assets/images/logo.webp");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarSrc(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogout = async () => {
    await logout();
    resetAccessToken();
    router.push("/");
  };

  return (
    <Card className="flex w-full max-w-[400px] flex-col items-center border-0 shadow-none">
      <CardHeader className="flex flex-col items-center gap-3 text-center">
        <Avatar
          className="h-24 w-24 cursor-pointer"
          onClick={handleAvatarClick}
        >
          <AvatarImage src={avatarSrc} alt={user.name} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <div className="pointer-events-none select-none">
          <CardTitle>{user.companyName}</CardTitle>
          <CardDescription className="mt-3 text-2xl">
            {user.name} 님
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex w-full select-none flex-col items-center">
        <div className="flex w-full flex-col justify-center gap-3">
          <ChangePasswordModal />
          <Button
            variant="outline"
            className="w-full bg-mainColor text-white dark:bg-white dark:text-subColor"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
          <div className="flex justify-center">
            <WithdrawalAccountModal>
              <p className="inline-flex cursor-pointer text-sm underline">
                회원탈퇴
              </p>
            </WithdrawalAccountModal>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Info;
