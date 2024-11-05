import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import { cn } from "@/app/_libs/utils";

export function UnlocksPlaceholder({
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
