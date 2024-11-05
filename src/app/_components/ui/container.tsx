import { cn } from "@/app/_libs/utils";
import React from "react";

export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("w-full max-w-6xl mx-auto px-2 md:px-4", className)}
    {...props}
  />
));
Container.displayName = "Container";
