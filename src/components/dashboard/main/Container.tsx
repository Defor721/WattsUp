import React, { ReactNode } from "react";

function Container({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1920px] p-5 dark:bg-subColor dark:text-white md:w-full xl:p-10">
      {children}
    </div>
  );
}

export default Container;
