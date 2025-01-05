"use client";

import React, { useEffect, useRef, useState } from "react";
import { CircleX, FileText, ImagePlus, Paperclip } from "lucide-react";
import Image from "next/image";

import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";

import Container from "../dashboard/main/Container";
import Title from "../ui/Title";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../shadcn";
import Chatting from "./Chatting";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type UploadedItem = {
  file: File;
  type: "image" | "file";
};

function DataReport() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [uploadedItems, setUploadedItems] = useState<UploadedItem[]>([]); // 이미지와 파일 상태 관리
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // 선택된 이미지

  const { toast } = useToast(); // Toast 사용
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        role: "user",
        content: input.trim(),
      };
      setMessages([...messages, newMessage]);
      setInput("");

      if (textareaRef.current) {
        textareaRef.current.style.height = "40px"; // 초기 높이로 설정
      }

      // 가짜 AI 응답 추가
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          role: "assistant",
          content: "안녕하세요! 어떤 도움이 필요하신가요?",
        };
        setMessages((prev) => [...prev, aiResponse]);
      }, 1000);
    }
  };

  // 파일 및 이미지 업로드 처리 함수
  const handleUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "file",
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files).map((file) => ({ file, type }));

      // 업로드 가능한 파일 및 이미지가 10개를 초과하면 Toast 표시
      if (uploadedItems.length + fileArray.length > 10) {
        toast({
          title: "파일 및 이미지는 총 10개까지만 업로드 가능합니다.",
          variant: "destructive",
        });
        return;
      }

      setUploadedItems((prev) => [...prev, ...fileArray]); // 업로드 항목 상태 업데이트
    }
  };

  // 업로드 항목 삭제 함수
  const removeItem = (index: number) => {
    setUploadedItems((prev) => prev.filter((_, i) => i !== index)); // 특정 항목 삭제
  };

  const handleTextareaInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px"; // 항상 초기 높이로 설정
      const newHeight = Math.min(textareaRef.current.scrollHeight, 120); // 최대 높이 제한
      if (newHeight > 40) {
        textareaRef.current.style.height = `${newHeight}px`; // 필요한 경우에만 높이 조정
      }
    }
  };

  return (
    <Container>
      <Title title="데이터 분석 리포트" />
      <Card className="mx-auto w-full max-w-[720px]">
        <CardHeader>
          <CardTitle>채팅</CardTitle>
        </CardHeader>
        <CardContent>
          <Chatting messages={messages} />

          {/* 텍스트 or 파일/이미지 업로드 부분 */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 flex flex-col px-[10px] py-[4px]"
          >
            {/* 업로드 미리 보기 섹션 */}
            <div
              className={cn(
                "overflow-x-auto rounded-tl-md rounded-tr-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
                uploadedItems.length > 0 ? "h-auto p-[6px]" : "h-0",
              )}
            >
              <div className="flex gap-2">
                {uploadedItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative flex cursor-pointer items-center justify-center rounded-lg bg-white dark:bg-gray-700"
                  >
                    {item.type === "image" ? (
                      <Dialog>
                        <DialogTrigger asChild>
                          <div className="h-14 w-14">
                            <Image
                              width={56}
                              height={56}
                              src={URL.createObjectURL(item.file)}
                              alt="사용자가 업로드한 이미지 미리보기"
                              className="h-full w-full rounded-lg object-cover"
                              onClick={() =>
                                setSelectedImage(URL.createObjectURL(item.file))
                              }
                            />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="flex h-full max-h-[55vh] w-full max-w-[70vw] items-center justify-center border-0 p-0">
                          <DialogTitle></DialogTitle>
                          <img
                            src={selectedImage || ""}
                            alt="사용자가 업로드한 이미지 모달"
                            className="max-h-[55vh] max-w-[70vw] object-contain"
                          />
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <div className="flex w-80 items-center gap-2 p-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-500">
                          <FileText />
                        </div>
                        <div className="text-center text-sm">
                          {item.file.name}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 이벤트 전파 방지
                        removeItem(index);
                      }}
                      className="absolute right-[-8px] top-[-5px] rounded-full bg-gray-100 text-xs dark:bg-gray-800"
                    >
                      <CircleX />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTextareaInput(); // 동적 높이 조정
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // 기본 줄바꿈 동작 막기
                  handleSubmit(e); // 메시지 보내기
                }
              }}
              placeholder="메시지를 입력하세요..."
              className={cn(
                "h-10 w-full resize-none overflow-y-auto bg-gray-100 pl-2 pt-2 text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-200",
                uploadedItems.length > 0 ? "" : "rounded-tl-md rounded-tr-md",
              )}
            />

            <div className="flex w-full items-center gap-3 rounded-bl-md rounded-br-md bg-gray-100 px-4 py-2 dark:bg-gray-800">
              {/* 파일 업로드 */}
              <Label
                htmlFor="file-upload"
                className="flex cursor-pointer items-center text-gray-700 dark:text-gray-200"
              >
                <Paperclip size={20} />
              </Label>
              <Input
                id="file-upload"
                type="file"
                onChange={(e) => handleUpload(e, "file")}
                className="hidden"
              />

              {/* 이미지 업로드 */}
              <Label
                htmlFor="image-upload"
                className="flex cursor-pointer items-center text-gray-700 dark:text-gray-200"
              >
                <ImagePlus size={20} />
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleUpload(e, "image")}
                className="hidden"
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}

export default DataReport;
