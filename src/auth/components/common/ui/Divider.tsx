interface DividerProps {
  children?: React.ReactNode;
}

export default function Divider({ children }: DividerProps) {
  return (
    <div className="my-1 flex w-full items-center text-sm">
      <div
        className={`flex-grow border-t ${
          children ? "mr-4" : ""
        } border-gray-300`}
      ></div>
      {children && (
        <span className="text-gray-500 dark:text-gray-300">{children}</span>
      )}
      <div
        className={`flex-grow border-t ${
          children ? "ml-4" : ""
        } border-gray-300`}
      ></div>
    </div>
  );
}
