import React, { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mt-8 dark:bg-[#050a18] dark:text-white md:w-full">
      {children}
    </div>
  );
}

export default Container;
