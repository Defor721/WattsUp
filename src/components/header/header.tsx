import Link from "next/link";
import { Search } from "lucide-react";

import { UserDropdown } from "./UserDropdown";
import { Input } from "../shadcn";

export function Header() {
  return (
    <header className="fixed top-0 z-50 flex w-[165vh] items-center justify-between bg-[rgb(7,15,38)] px-8 py-4 text-white shadow-md">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <h1 className="text-lg font-bold">
            <span className="bg-gradient-to-r from-teal-200 to-blue-300 bg-clip-text text-transparent">
              Watts_uP
            </span>
          </h1>
        </Link>
        <div className="flex max-w-md flex-1 items-center space-x-4">
          <div className="relative w-full">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full border-[rgb(20,35,80)] bg-[rgb(13,23,53)] pl-10 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <UserDropdown />
      </div>
    </header>
  );
}
