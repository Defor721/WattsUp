"use client";

import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface ArrowBackProps {
  path?: string;
}

export default function ArrowBack({ path }: ArrowBackProps) {
  const router = useRouter();

  const handlePrevClick = () => {
    if (path) {
      router.push(path);
    } else {
      router.back();
    }
  };

  return (
    <>
      <button onClick={handlePrevClick}>
        <IoIosArrowBack
          size={"20px"}
          className="absolute left-1 top-2 opacity-50 hover:cursor-pointer hover:opacity-80"
        />
      </button>
    </>
  );
}
