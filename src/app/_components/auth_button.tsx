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
import { Link } from "@/app/_components/ui/link";
import { User } from "@/unlockrepo/user/user";
import { LogOut } from "lucide-react";

export async function AuthButton({
  prepend = null,
}: {
  prepend?: React.ReactNode;
}) {
  const session = await getSession();

  if (session.user) {
    return (
      <div className="flex items-center gap-x-3">
        {prepend}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none border-2 rounded-full">
            <FullAvatar
              fallback={session.user.username[0]}
              src={User.getResizedAvatarURL(session.user, 64)}
              className="size-9"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{session.user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/api/auth/signout">
                <LogOut size={16} /> Sign out
              </Link>
            </DropdownMenuItem>
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
  return <div className="text-sm font-semibold">loading...</div>;
}
