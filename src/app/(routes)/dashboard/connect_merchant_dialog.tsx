"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog";
import { cn } from "@/app/_libs/utils";

export function ConnectMerchantDialog({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [connectingMerchant, setConnectingMerchant] = useState<
    "gumroad" | "lemonsqueezy" | undefined
  >();

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader className="space-y-3">
          <DialogTitle>Connect your Merchant Account</DialogTitle>
          <DialogDescription>
            Before unlocking a repository, please connect a merchant account.
          </DialogDescription>
          <ul className="space-y-4">
            <li>
              <Merchant
                name="Gumroad"
                connecting={connectingMerchant === "gumroad"}
                onConnect={() => setConnectingMerchant("gumroad")}
                logoSrc="/gumroad.svg"
                connectionURL="/api/connections/gumroad"
              />
            </li>
            <li>
              <Merchant
                disabled
                name="Lemon Squeezy"
                description="Coming Soon"
                connecting={connectingMerchant === "lemonsqueezy"}
                onConnect={() => setConnectingMerchant("lemonsqueezy")}
                logoSrc="/lemonsqueezy.svg"
                connectionURL="/api/connections/gumroad"
              />
            </li>
          </ul>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function Merchant({
  name,
  description,
  logoSrc,
  connecting,
  connectionURL,
  disabled = false,
  onConnect,
}: {
  name: React.ReactNode;
  description?: string;
  logoSrc: string;
  connecting: boolean;
  connectionURL: string;
  disabled?: boolean;
  onConnect: () => void;
}) {
  return (
    <div
      className={cn("flex items-center space-x-4 rounded-md border p-4", {
        "opacity-50 pointer-events-none": disabled,
      })}
    >
      <Image width={50} height={50} alt="Gumroad" src={logoSrc} />
      <div className="flex-1 space-y-1">
        <p className="text-sm leading-none font-semibold">{name}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Button
        asChild={!connecting}
        variant="outline"
        className="w-32"
        disabled={disabled || connecting}
        onClick={onConnect}
      >
        {connecting ? (
          <LoaderCircle size={16} className="animate-spin" />
        ) : (
          <Link href={connectionURL}>Connect</Link>
        )}
      </Button>
    </div>
  );
}
