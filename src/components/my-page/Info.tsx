import React, { useRef, useState } from "react";
import { LogOut } from "lucide-react";

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

import Modal from "./Modal";

function Info() {
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

  return (
    <Card className="flex w-full max-w-[400px] flex-col items-center border-0 shadow-none">
      <CardHeader className="flex flex-col items-center text-center">
        <Avatar
          className="h-24 w-24 cursor-pointer"
          onClick={handleAvatarClick}
        >
          <AvatarImage src={avatarSrc} alt="김터빈" />
          <AvatarFallback>김터빈</AvatarFallback>
        </Avatar>
        <Input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
        />
        <CardTitle className="mt-4">김터빈</CardTitle>
        <CardDescription>김터빈@gmail.com</CardDescription>
      </CardHeader>
      <CardContent className="flex w-full flex-col items-center">
        <div className="flex w-full flex-col justify-center gap-3">
          <Modal />
          <Button
            variant="outline"
            className="w-full bg-subColor text-white dark:bg-white dark:text-subColor"
          >
            <LogOut className="mr-2 h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Info;
