"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut } from "lucide-react";

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="relative" onMouseLeave={() => setIsOpen(false)}>
      <button
        className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/10"
        onMouseEnter={() => setIsOpen(true)}
      >
        <Image
          src="/assets/images/logo.webp"
          width={36}
          height={36}
          alt="User Avatar"
          className="rounded-full"
        />
        <div className="flex-1 text-left">
          <p className="text-sm font-medium">김왔썹</p>
          <p className="text-xs text-gray-400">김왔썹@gmail.com</p>
        </div>
      </button>
      <div
        className={`absolute bottom-full left-0 mb-2 w-56 rounded-lg bg-white text-black shadow-lg transition-all duration-200 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible translate-y-2 opacity-0"
        }`}
      >
        <div className="p-2">
          <p className="px-3 py-2 text-sm font-semibold">My Account</p>
          <hr className="my-1" />
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            onClick={() => router.push("/profile")}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </button>
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            onClick={() => router.push("/settings")}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <hr className="my-1" />
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100"
            onClick={() => {
              /* 로그아웃 로직 */
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
