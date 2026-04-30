import { type ReactNode } from "react";

type Width = "prose" | "page";

/**
 * Width-aware wrapper. Use `prose` for reading columns (max 65ch), `page`
 * for hero sections, lists, and utility pages.
 */
export function Container({
  children,
  width = "page",
  className = "",
}: {
  children: ReactNode;
  width?: Width;
  className?: string;
}) {
  const widthClass = width === "prose" ? "max-w-prose" : "max-w-page";
  // 20px (px-5) gutter on mobile per the layout spec; 32px (px-8) on
  // tablet and up so the chrome breathes inside larger viewports.
  return (
    <div className={`${widthClass} mx-auto px-5 md:px-8 ${className}`}>
      {children}
    </div>
  );
}
