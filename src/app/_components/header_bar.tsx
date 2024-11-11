import { Suspense } from "react";
import { cn } from "@/app/_libs/utils";
import { AuthButton, AuthButtonFallback } from "@/app/_components/auth_button";

export function HeaderBar({ className }: { className?: string }) {
  return (
    <header
      className={cn("flex justify-center py-4 items-center gap-x-3", className)}
    >
      <Suspense fallback={<AuthButtonFallback />}>
        <AuthButton />
      </Suspense>
    </header>
  );
}
