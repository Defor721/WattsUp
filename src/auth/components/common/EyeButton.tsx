import { Eye, EyeOff } from "lucide-react";
import { Dispatch } from "react";

import { Button } from "@/components/shadcn";

interface EyeButtonProps {
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
  right: number;
}

export default function EyeButton({ show, setShow, right }: EyeButtonProps) {
  return (
    <>
      <Button
        type="button"
        className={`absolute right-${right} top-[12px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent`}
        size={"icon"}
        onClick={() => setShow((prevState) => !prevState)}
      >
        {show ? (
          <Eye className="text-muted-foreground h-5 w-5 opacity-70" />
        ) : (
          <EyeOff className="text-muted-foreground h-5 w-5 opacity-70" />
        )}
      </Button>
    </>
  );
}
