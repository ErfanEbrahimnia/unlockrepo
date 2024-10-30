import Link from "next/link";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";

export function Hero() {
  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-8 justify-center items-center h-[450px]">
      <div>
        <h1 className="text-4xl font-bold mb-4">
          Automate Github Repository Access
        </h1>
        <p className="text-lg mb-3">
          UnlockRepo automates the process of granting access to your private
          repositories once a purchase is made on Gumroad
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">Get Started</Link>
        </Button>
      </div>
      <div className="flex lg:justify-center pointer-events-none">
        <div className="flex size-[370px] justify-center items-center bg-amber-50 rounded-3xl shadow-amber-200/60 shadow">
          <div className="flex size-[310px] justify-center items-center bg-amber-100/50 rounded-3xl shadow-amber-300/60 shadow">
            <Image
              alt=""
              src="/hero_illustration.png"
              width={140}
              height={191}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
