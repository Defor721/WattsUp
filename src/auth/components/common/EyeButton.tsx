import { Eye, EyeOff } from "lucide-react";
import { Dispatch } from "react";

import { Button } from "@/components/shadcn";

interface EyeButtonProps {
  show: boolean;
  setShow: Dispatch<React.SetStateAction<boolean>>;
}

export default function EyeButton({ show, setShow }: EyeButtonProps) {
  return (
    <>
      <Button
        type="button"
        className="absolute right-1 top-[9px] z-10 -translate-y-1/4 bg-transparent hover:bg-transparent"
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
