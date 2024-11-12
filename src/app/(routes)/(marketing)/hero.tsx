import { Suspense } from "react";
import { AuthButton, AuthButtonFallback } from "@/app/_components/auth_button";
import { Link } from "@/app/_components/ui/link";
import { cn } from "@/app/_libs/utils";

export function Hero({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center h-screen",
        className
      )}
    >
      <div className="max-w-[650px] text-center">
        <div className="font-bold text-xl md:text-2xl mb-4">🔐 UnlockRepo</div>
        <h1 className="text-2xl md:text-4xl font-bold mb-3">
          Automate Github Repository Access
        </h1>
        <p className="md:text-lg mb-6">
          UnlockRepo automates the process of granting access to your private
          repositories once a purchase is made on Gumroad
        </p>
        <div className="flex justify-center">
          <Suspense fallback={<AuthButtonFallback />}>
            <AuthButton
              prepend={
                <Link href="/dashboard" className="font-semibold text-sm">
                  Dashboard
                </Link>
              }
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
