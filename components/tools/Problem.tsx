import type { ReactNode } from "react";

interface ProblemProps {
  title: string;
  children: ReactNode;
}

export default function Problem({ title, children }: ProblemProps) {
  return (
    <div className="problem" role="alert">
      <p>{title}</p>
      <p>{children}</p>
    </div>
  );
}
