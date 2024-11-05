import { Loader2 } from "lucide-react";
import {
  type ConfirmProps,
  ConfirmProvider as ConfirmProviderThirdParty,
  useConfirm as useConfirmThirdParty,
} from "react-confirm-hook";
import { Button, type ButtonProps } from "@/app/_components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

export const ConfirmProvider = ConfirmProviderThirdParty;

export function useConfirm() {
  return useConfirmThirdParty(ConfirmAlert);
}

interface ConfirmAlertProps extends ConfirmProps {
  title: string;
  message: string;
  confirmButtonLabel?: string;
  confirmButtonVariant?: ButtonProps["variant"];
  hideCancelButton?: boolean;
}

function ConfirmAlert({
  open,
  title,
  message,
  confirmButtonLabel = "Confirm",
  confirmButtonVariant = "default",
  onConfirm,
  onCancel,
  isConfirming,
  hideCancelButton = false,
}: ConfirmAlertProps) {
  function onOpenChange(open: boolean) {
    if (open === false && isConfirming === false) {
      onCancel();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {!hideCancelButton && (
            <DialogClose asChild disabled={isConfirming}>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
          )}
          <Button
            variant={confirmButtonVariant}
            disabled={isConfirming}
            onClick={onConfirm}
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmButtonLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
