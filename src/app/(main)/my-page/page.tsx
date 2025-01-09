"use client";

import { Separator } from "@/components/shadcn";
import Info from "@/components/my-page/Info";
import Stats from "@/components/my-page/Stats";
import RecentLog from "@/components/my-page/RecentLog";

export default function Mypage() {
  return (
    <div className="mx-auto flex max-w-[1024px] flex-col items-center gap-3 p-5">
      <h2 className="pointer-events-none select-none scroll-m-20 pt-5 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
        마이 페이지
      </h2>

      <Info />

      <Separator className="bg-gray-200" />

      <div className="flex w-full flex-col gap-3">
        <Stats />

        <Separator className="bg-gray-200" />

        <RecentLog />
      </div>
    </div>
  );
}
