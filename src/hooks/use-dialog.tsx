"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/shadcn/dialog";

type DialogOptions = {
  title: string;
  description: string;
  confirmText?: string;
  onConfirm?: () => void;
};

const NULL_DIALOG_OPTIONS: DialogOptions = {
  title: "",
  description: "",
  confirmText: "확인",
  onConfirm: () => {},
};

export function useDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<DialogOptions>(NULL_DIALOG_OPTIONS);

  /**
   * 새 옵션을 설정하고 다이얼로그를 엽니다.
   * @param {DialogOptions} newOptions - 다이얼로그에 표시할 옵션.
   * @property {string} title - 다이얼로그 제목.
   * @property {string} description - 다이얼로그 설명.
   * @property {string} confirmText - 확인 버튼 텍스트. (선택)
   * @property {() => void} onConfirm - 확인 버튼 클릭 시 실행할 콜백 함수.
   */
  const showDialog = (newOptions: DialogOptions) => {
    setOptions({
      ...NULL_DIALOG_OPTIONS,
      ...newOptions,
    });
    setIsOpen(true);
  };

  /**
   * 다이얼로그가 위치할 곳에 위치시켜주세요.
   * @returns {JSX.Element} 다이얼로그 UI 컴포넌트
   */
  const DialogComponent = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-black">
        <DialogTitle className="text-white">{options.title}</DialogTitle>
        <DialogDescription className="text-white">
          {options.description}
        </DialogDescription>
        <DialogClose asChild>
          <button
            className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            onClick={() => {
              setIsOpen(false);
              options.onConfirm?.();
            }}
          >
            {options.confirmText}
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );

  return { showDialog, DialogComponent };
}
