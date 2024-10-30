import Link from "next/link";
import { getSession } from "@/app/_libs/auth/session";
import { Button } from "@/app/_components/ui/button";
import { FullAvatar } from "@/app/_components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown_menu";

export async function AuthButton() {
  const session = await getSession();

  if (session.user) {
    return (
      <div className="flex items-center gap-x-3">
        <Link className="text-sm font-semibold" href="/dashboard">
          Dashboard
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <FullAvatar
              fallback="CN"
              src="https://github.com/shadcn.png"
              className="size-8"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>shadcn</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  if (!session.user) {
    return (
      <Button asChild>
        <Link href="/api/auth/github">Sign In</Link>
      </Button>
    );
  }
}

export function AuthButtonFallback() {
  return <Button disabled>loading...</Button>;
}
