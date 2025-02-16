"use client";

interface Props {
  children: React.ReactNode;
}

export default function Content({ children }: Props) {
  return (
    <div className="w-full p-4 lg:px-44 lg:py-12 min-h-screen">{children}</div>
  );
}
