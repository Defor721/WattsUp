"use client";

import Image from "next/image";
import React from "react";
import {
  IoMdHome,
  FaExchangeAlt,
  IoMdSettings,
  FaChevronRight,
} from "@/public/assets/icons";
import { Separator } from "@/components/shadcn";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sideLists = [
  {
    icons: <IoMdHome />,
    label: "Dashboard",
  },
  {
    icons: <FaExchangeAlt />,
    label: "Trade",
  },
  {
    icons: <IoMdSettings />,
    label: "Settings",
  },
];

export default function Sidebar() {
  const router = useRouter();
  const handleClickUser = () => {
    router.push("#");
  };

  return (
    <aside className="flex flex-col justify-between  w-[240px] h-[100vh] p-4 bg-rose-100 border-l border-l-red-500">
      <div className="flex flex-col gap-3">
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/assets/images/logo.webp"
            width={50}
            height={50}
            alt="logo"
          />
          <div className="text-lg">WattsUp</div>
        </Link>
        <Separator />

        <ul className="flex flex-col items-start gap-1">
          {sideLists.map((side, index) => (
            <Link
              href={`/${side.label.toLowerCase()}`}
              key={index}
              className="flex items-center gap-2 cursor-pointer w-full hover:bg-slate-400 p-2 rounded-sm"
            >
              <div>{side.icons}</div>
              <li>{side.label}</li>
            </Link>
          ))}
        </ul>
      </div>

      <Separator />

      <div
        className="flex items-center justify-between hover:cursor-pointer"
        onClick={handleClickUser}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.webp"
            width={50}
            height={50}
            alt="user_image"
            className="rounded-full"
          />
          <div>
            <div>이름</div>
            <div className="text-sm">Account settings</div>
          </div>
        </div>
        <FaChevronRight className="text-white  size-3 opacity-70" />
      </div>
    </aside>
  );
}
