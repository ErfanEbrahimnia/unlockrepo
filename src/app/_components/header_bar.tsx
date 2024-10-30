import { Suspense } from "react";
import { AuthButton, AuthButtonFallback } from "@/app/_components/auth_button";

export function HeaderBar() {
  return (
    <header className="flex justify-between py-4 items-center">
      <div className="font-bold text-2xl">🔐 UnlockRepo</div>
      <Suspense fallback={<AuthButtonFallback />}>
        <AuthButton />
      </Suspense>
    </header>
  );
}
