import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="flex h-28 w-72 items-center justify-center rounded-lg bg-white shadow">
      {children}
    </div>
  );
}

export { Card };
