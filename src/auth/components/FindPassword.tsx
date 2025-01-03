"use client";

import { useState } from "react";

import { toast } from "@/hooks/useToast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Label,
  Input,
} from "@/components/shadcn";

interface Props {
  children: React.ReactNode;
}

function FindPasswordPopup({ children }: Props) {
  const [email, setEmail] = useState<string>("");

  const handleSendConfirmEmail = async () => {
    try {
      toast({
        title: "비밀번호 초기화 이메일을 전송했습니다.",
        description:
          "이메일 주소로 비밀번호 초기화 링크를 전송했으니, 이메일을 확인하여 비밀번호를 변경하세요!",
      });
    } catch (error) {
      /** 네트워크 오류나 예기치 않은 에러를 잡기 위해 catch 구문 사용 */
      console.error(error);
      toast({
        variant: "destructive",
        title: "네트워크 오류",
        description: "서버와 연결할 수 없습니다. 다시 시도해주세요!",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>비밀번호를 잊으셨나요?</AlertDialogTitle>
          <AlertDialogDescription>
            비밀번호 초기화를 위해 본인의 이메일 주소를 하단에 기입해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Label htmlFor="email">이메일</Label>
          <Input
            id="email"
            type="email"
            placeholder="이메일을 입력하세요."
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction
            className="bg-[#070f26] dark:border-1"
            onClick={handleSendConfirmEmail}
          >
            전송
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { FindPasswordPopup };
