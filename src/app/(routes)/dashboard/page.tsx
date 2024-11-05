import Link from "next/link";
import { getSessionOrRedirect } from "@/app/_libs/auth/session";
import { createAppServices } from "@/unlockrepo/app_services";
import { Button } from "@/app/_components/ui/button";
import { Connection } from "@/unlockrepo/user/connection";
import { cn } from "@/app/_libs/utils";
import type { UserWithConnections } from "@/unlockrepo/user/user";
import { ConnectMerchantDialog } from "./connect_merchant_dialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { Unlocks } from "./unlocks";

export default async function Dashboard() {
  const { user } = await getSessionOrRedirect();

  const services = createAppServices();
  const unlocks = await services.unlock.repo.findByUserId(user.id);

  if (unlocks.length === 0) {
    return (
      <UnlocksPlaceholder title="No unlocked repositories">
        <AddRepositoryButton user={user} />
      </UnlocksPlaceholder>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-semibold">Unlocks</h1>
        <AddRepositoryButton user={user} />
      </div>
      <Unlocks
        username={user.username}
        unlocks={unlocks.map((unlock) => ({
          id: unlock.id,
          repositoryName: unlock.repositoryName,
          repositoryURL: unlock.repositoryURL,
          productName: unlock.productName,
          productURL: unlock.productURL,
          createdAt: unlock.createdAt,
        }))}
      />
    </div>
  );
}

function AddRepositoryButton({ user }: { user: UserWithConnections }) {
  const hasConnectedMerchants = user.connections.some((connection) =>
    Connection.isMerchant(connection)
  );

  return hasConnectedMerchants ? (
    <Button asChild>
      <Link href="/dashboard/new">Add Repository</Link>
    </Button>
  ) : (
    <ConnectMerchantDialog trigger={<Button>Add Repository</Button>} />
  );
}

function UnlocksPlaceholder({
  title,
  className,
  children,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn("lg:py-10", className)}>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-center">{children}</CardContent>
    </Card>
  );
}
