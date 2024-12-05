"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  IoMdHome,
  FaExchangeAlt,
  IoMdSettings,
  FaChevronRight,
  IoLogInOutline,
  IoPersonOutline,
  FaChartLine,
  FaDollarSign,
} from "../../../public/assets/icons";
import { Separator } from "@/components/shadcn";
import { useLoginStore } from "@/stores";

const sideLists = [
  {
    icons: <IoMdHome />,
    label: "Dashboard",
  },
  //   {
  //     icons: <IoPersonOutline />,
  //     label: "Mypage",
  // },
  {
    icons: <FaChartLine />,
    label: "Power Generation Forecasting",
  },
  {
    icons: <FaDollarSign />,
    label: "Profitability Analysis",
  },
  {
    icons: <FaExchangeAlt />,
    label: "Trading",
  },
  {
    icons: <IoMdSettings />,
    label: "Settings",
  },
];

function Sidebar() {
  const router = useRouter();

  // const isLogin = useLoginStore((state) => state.isLogin);
  /**isLogin: Zustand 스토어에서 가져온 로그인 상태. */

  // useEffect(() => {
  //   console.log(isLogin);
  // }, [isLogin]);

  const handleUserClick = () => {
    // router.push("#");
    // login();
  };

  const handleLoginClick = () => {
    router.push("/login");
  };

  return (
    <aside className="flex h-[100vh] w-[240px] flex-col justify-between border-r border-r-[rgb(8,16,40)] bg-[rgb(8,16,41)] p-4 text-white">
      <div className="flex flex-col">
        <Link
          href={"/"}
          className="flex h-[84px] cursor-pointer items-center gap-4"
        >
          <Image
            src="/assets/images/logo.webp"
            className="h-[60px] w-[60px] rounded-xl"
            width={64}
            height={64}
            alt="logo"
          />
          <div className="text-2xl">WattsUp</div>
        </Link>
        <Separator />

        <ul className="flex flex-col items-start gap-1">
          {sideLists.map((side, index) => (
            <Link
              href={`/${side.label.toLowerCase().trim()}`}
              key={index}
              className="flex w-full cursor-pointer items-center gap-4 rounded-lg p-2 transition duration-300 ease-in-out hover:bg-slate-400 hover:text-[rgb(8,16,40)]"
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
        onClick={handleUserClick}
      >
        <div className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.webp"
            width={50}
            height={50}
            alt="user_image"
            className="rounded-xl"
          />
          <div>
            <div>이름</div>
            <div className="text-sm">Account settings</div>
          </div>
        </div>
        <FaChevronRight className="size-3 text-white opacity-70" />
      </div>
      {/* {isLogin ? (
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
              className="rounded-xl"
            />
            <div>
              <div>이름</div>
              <div className="text-sm">Account settings</div>
            </div>
          </div>
          <FaChevronRight className="size-3 text-white opacity-70" />
        </div>
      ) : (
        <div
          className="flex items-center gap-2 p-2 hover:cursor-pointer"
          onClick={handleLoginClick}
        >
          <div>로그인</div>

          <IoLogInOutline className="size-5 text-white" />
        </div>
      )} */}
    </aside>
  );
}
export default Sidebar;
