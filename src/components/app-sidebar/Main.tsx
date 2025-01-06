import React from "react";
import Link from "next/link";

interface data {
  id: string;
  icon: any;
  label: string;
  href: string;
}

interface Props {
  items: data[];
  isTablet: boolean;
  isTabletExpanded: boolean;
}

function NavMain({ items, isTablet, isTabletExpanded }: Props) {
  // 테블릿 화면일 경우
  if (isTablet && !isTabletExpanded)
    return (
      <div className="flex flex-col items-center gap-4 p-2">
        {items.map((item) => (
          <Link
            key={item.id}
            className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-[rgb(20,35,80)] hover:text-white focus:bg-[rgb(20,35,80)] focus:text-white"
            href={item.href}
          >
            <item.icon />
          </Link>
        ))}
      </div>
    );

  // 테블릿 화면에서 사이드바 확장 and 평상시 화면
  return (
    <div className="flex flex-col gap-4 p-2">
      {items.map((item) => (
        <Link
          key={item.id}
          className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:bg-[rgb(20,35,80)] hover:text-white focus:bg-[rgb(20,35,80)] focus:text-white md:text-base"
          href={item.href}
        >
          <item.icon />
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  );
}
export default NavMain;
