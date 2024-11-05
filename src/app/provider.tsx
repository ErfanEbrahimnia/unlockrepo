"use client";

import { ConfirmProvider } from "./_hooks/use_confirm";

export function Provider({ children }: { children: React.ReactNode }) {
  return <ConfirmProvider>{children}</ConfirmProvider>;
}
