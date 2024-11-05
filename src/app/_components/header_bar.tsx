import { Suspense } from "react";
import { AuthButton, AuthButtonFallback } from "@/app/_components/auth_button";
import { cn } from "@/app/_libs/utils";

export function HeaderBar({ className }: { className?: string }) {
  return (
    <header className={cn("flex justify-between py-4 items-center", className)}>
      <div className="font-bold text-2xl">🔐 UnlockRepo</div>
      <Suspense fallback={<AuthButtonFallback />}>
        <AuthButton />
      </Suspense>
    </header>
  );
}
