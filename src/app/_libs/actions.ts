import { toast } from "@/app/_components/ui/sonner";

export function withErrorHandling<T extends Promise<any>>(action: T) {
  return action.catch((error: unknown) => {
    if (error instanceof Error) {
      toast.error(error.message);
    }
  });
}
