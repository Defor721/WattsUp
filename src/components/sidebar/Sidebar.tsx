"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import {
  IoMdHome,
  FaExchangeAlt,
  IoMdSettings,
  FaChevronRight,
  IoLogInOutline,
} from "@/public/assets/icons";
import { Separator } from "@/components/shadcn";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoginStore } from "@/stores";

const sideLists = [
  {
    icons: <IoMdHome />,
    label: "Dashboard",
  },
  {
    icons: <FaExchangeAlt />,
    label: "Mypage",
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

function Sidebar() {
  const router = useRouter();

  const isLogin = useLoginStore((state) => state.isLogin);

  useEffect(() => {
    console.log(isLogin);
  }, [isLogin]);

  const handleUserClick = () => {
    // router.push("#");
    // login();
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <aside className="flex flex-col justify-between  w-[240px] h-[100vh] p-4 bg-[rgb(8,16,41)] text-white border-r border-r-[rgb(8,16,40)]">
      <div className="flex flex-col ">
        <Link href={"/"} className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/assets/images/logo.webp"
            width={64}
            height={64}
            alt="logo"
          />
          <div className="text-lg">WattsUp</div>
        </Link>
        <Separator />

        <ul className="flex flex-col items-start gap-1">
          {sideLists.map((side, index) => (
            <Link
              href={`/${side.label.toLowerCase().trim()}`}
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
      {isLogin ? (
        <div
          className="flex items-center justify-between hover:cursor-pointer"
          onClick={handleUserClick}
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
      ) : (
        <div
          className="flex items-center gap-2 hover:cursor-pointer p-2"
          onClick={handleLoginClick}
        >
          <div>로그인</div>

          <IoLogInOutline className="text-white  size-5" />
        </div>
      )}
    </aside>
  );
}
export default Sidebar;
