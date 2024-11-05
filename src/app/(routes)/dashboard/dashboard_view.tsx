"use client";

import { use } from "react";
import type { Unlock } from "@/unlockrepo/unlock/unlock";

export function DashboardView({
  unlocksPromise,
}: {
  unlocksPromise: Promise<Unlock[]>;
}) {
  const unlocks = use<Unlock[]>(unlocksPromise);

  if (unlocks.length === 0) {
  }

  return null;
}
