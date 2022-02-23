import { ReactNode } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/outline";

type ErrorProps = {
  children: ReactNode;
};

function Error({ children }: ErrorProps) {
  return (
    <div className="flex items-center text-sm font-semibold text-red-500">
      <ExclamationCircleIcon className="mr-2 h-5 w-5" />
      {children}
    </div>
  );
}

export { Error };
