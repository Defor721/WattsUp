import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn";

interface SelectorProps {
  width?: string;
  value: any;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
  items: {
    value: string;
    label: string;
  }[];
}

function Selector({
  width = "w-[200px]",
  value,
  onChange,
  placeholder,
  items,
}: SelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger
        className={`${width} bg-white dark:bg-cardBackground-dark`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white dark:bg-cardBackground-dark">
        {items.map((item) => (
          <SelectItem
            value={item.value}
            key={item.value}
            className="hover:cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default Selector;
