"use client";

import React from "react";
import Image from "next/image";
import { FileText } from "lucide-react";

import { ScrollArea } from "../shadcn";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  attachments?: Array<{ type: "image" | "file"; name: string; url: string }>;
};

function Chatting({
  messages,
  messagesEndRef,
}: {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>; // null 허용
}) {
  return (
    <ScrollArea id="chat-container" className="mb-5 h-[60vh] pr-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex flex-col ${
            message.role === "user" ? "items-end" : "items-start"
          }`}
        >
          {/* 첨부파일 렌더링 */}
          {message.attachments && (
            <div className="flex flex-col gap-2">
              {message.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`flex items-center ${
                    attachment.type === "image" ? "h-20 w-20" : "w-80"
                  } rounded-3xl bg-gray-200 p-2 dark:bg-gray-700`}
                >
                  {attachment.type === "image" ? (
                    <Image
                      src={attachment.url}
                      alt={attachment.name}
                      width={56}
                      height={56}
                      className="rounded-3xl object-cover"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-rose-500">
                        <FileText />
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        {attachment.name}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 텍스트 메시지 */}
          {message.content && (
            <div className="mt-2 rounded-3xl bg-gray-200 px-5 py-[10px] dark:bg-gray-700">
              {message.content}
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}

export default Chatting;
