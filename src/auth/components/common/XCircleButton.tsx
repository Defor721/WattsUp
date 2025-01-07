import { XCircle } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

import { Button } from "@/components/shadcn";

interface XCircleButtonProps {
  right: number;
  reset: Dispatch<SetStateAction<string>>;
}

export default function XCircleButton({ right, reset }: XCircleButtonProps) {
  return (
    <Button
      onClick={() => reset("")}
      type="button"
      className={`absolute top-[12px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent`}
      style={{ right: `${right}px` }}
      size={"icon"}
    >
      <XCircle className="text-muted-foreground h-5 w-5 opacity-70" />
    </Button>
  );
}
