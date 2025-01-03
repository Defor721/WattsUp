import React, { useState } from "react";
import Link from "next/link";

interface data {
  id: string;
  icon: any;
  label: string;
  href: string;
  subItems?: data[]; // 서브메뉴 추가
}

interface Props {
  items: data[];
  isTablet: boolean;
  isTabletExpanded: boolean;
}

function NavMain({ items, isTablet, isTabletExpanded }: Props) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );

  const toggleSubMenu = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 테블릿 화면일 경우
  if (isTablet && !isTabletExpanded)
    return (
      <div className="flex flex-col items-center gap-4 p-2">
        {items.map((item) => (
          <Link
            key={item.id}
            className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80"
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
        <div key={item.id}>
          <div className="flex items-center justify-between">
            <Link
              className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-white hover:text-[rgb(7,15,38)] hover:opacity-80 md:text-base"
              href={item.href}
            >
              <item.icon />
              <span>{item.label}</span>
            </Link>
            {item.subItems && (
              <button
                onClick={() => toggleSubMenu(item.id)}
                className="p-1 text-white"
              >
                {expandedItems[item.id] ? "▲" : "▼"}
              </button>
            )}
          </div>

          {item.subItems && expandedItems[item.id] && (
            <div className="ml-4 flex flex-col gap-2">
              {item.subItems.map((subItem) => (
                <Link
                  key={subItem.id}
                  className="flex items-center gap-3 rounded-lg p-2 text-sm font-medium transition-all duration-200 hover:scale-105 hover:bg-gray-200 hover:text-[rgb(7,15,38)] hover:opacity-80"
                  href={subItem.href}
                >
                  <subItem.icon />
                  <span>{subItem.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default NavMain;
