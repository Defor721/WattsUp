"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronUp, ChevronDown, User, Settings, LogOut } from "lucide-react";

import { useAuthStore } from "@/auth/useAuthStore";
import useAccessToken from "@/auth/hooks/useAccessToken";

import { Button } from "../shadcn";

export function UserDropdown() {
  const {
    actions: { logout },
  } = useAuthStore();
  const { resetAccessToken } = useAccessToken();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    resetAccessToken();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center gap-3 focus:outline-none"
      >
        <Image
          src="/assets/images/logo.webp"
          alt="User Profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div className="flex-1 text-left">
          <span className="block text-sm font-medium text-gray-200">
            김터빈
          </span>
          <span className="block text-xs text-gray-400">김터빈@gmail.com</span>
        </div>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-full overflow-hidden rounded-md bg-[rgb(13,23,53)] shadow-lg">
          <div className="py-1">
            <a
              href="/my-page"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[rgb(20,35,80)] hover:text-white"
            >
              <User size={16} className="mr-2" />
              Mypage
            </a>
            <a
              href="/editprofile"
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[rgb(20,35,80)] hover:text-white"
            >
              <Settings size={16} className="mr-2" />
              Profile Settings
            </a>
            <Button
              className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-[rgb(20,35,80)] hover:text-white"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Log out
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
