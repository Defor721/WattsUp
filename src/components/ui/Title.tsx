import React from "react";

import { cn } from "@/lib/utils";

interface TitleProps {
  title: string;
  className?: string;
}

function Title({ title, className }: TitleProps) {
  return (
    <h2
      className={cn(
        "mb-3 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
    >
      {title}
    </h2>
  );
}

export default Title;
