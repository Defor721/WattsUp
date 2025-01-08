import React, { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1920px] p-5 dark:bg-[#050a18] dark:text-white md:w-full">
      {children}
    </div>
  );
}

export default Container;
