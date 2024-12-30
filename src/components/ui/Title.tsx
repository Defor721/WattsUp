import React from "react";

function Title({ title }: { title: string }) {
  return (
    <h2 className="mb-5 scroll-m-20 text-3xl font-semibold tracking-tight text-mainColor first:mt-0 dark:text-white">
      {title}
    </h2>
  );
}

export default Title;
