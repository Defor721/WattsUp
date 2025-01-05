"use client";

import React, { useEffect, useRef } from "react";

import { Avatar, AvatarFallback, ScrollArea } from "../shadcn";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

function Chatting({ messages }: { messages: Message[] }) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <ScrollArea className="h-[60vh] pr-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`mb-4 flex items-center ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "user" ? (
            <Avatar className="mr-2">
              <AvatarFallback></AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="mr-2">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          )}
          <div
            className={`rounded-2xl ${
              message.role === "user"
                ? "text-primary-foreground max-w-[500px] bg-[hsla(0,0%,91%,.5)] px-[20px] py-[10px] dark:bg-[rgba(50,50,50,.85)]"
                : ""
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </ScrollArea>
  );
}

export default Chatting;
