"use client";

import { Github, ShoppingCart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/_components/ui/table";
import { Button } from "@/app/_components/ui/button";
import { useConfirm } from "@/app/_hooks/use_confirm";
import { deleteUnlock } from "./_actions/delete_unlock";
import { toast } from "@/app/_components/ui/sonner";

export function Unlocks({
  username,
  unlocks,
}: {
  username: string;
  unlocks: {
    id: string;
    repositoryName: string;
    repositoryURL: string;
    productName: string;
    productURL: string;
    createdAt: Date;
  }[];
}) {
  const confirm = useConfirm();

  function onDeleteUnlock(unlockId: string) {
    confirm({
      title: "Delete?",
      message: "Are you sure you want to remove this unlock?",
      confirmButtonLabel: "Delete",
      confirmButtonVariant: "destructive",
      onConfirm: async () => {
        await deleteUnlock({ unlockId })
          .then(() => {
            toast.success("Successfully deleted unlock");
          })
          .catch(() => toast.error("Failed to delete unlock"));
      },
    });
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="pl-4">Repository</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Created</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {unlocks.map((unlock) => (
            <TableRow key={unlock.id}>
              <TableCell className="pl-4">
                <a
                  target="_blank"
                  className="underline font-semibold"
                  href={unlock.repositoryURL}
                >
                  <div className="flex gap-x-2 items-center">
                    <Github size={18} />{" "}
                    <div className="truncate max-w-52">{`${username}/${unlock.repositoryName}`}</div>
                  </div>
                </a>
              </TableCell>
              <TableCell>
                <a
                  target="_blank"
                  className="underline font-semibold"
                  href={unlock.productURL}
                >
                  <div className="flex gap-x-2 items-center">
                    <ShoppingCart size={18} />{" "}
                    <div className="truncate max-w-52">
                      {unlock.productName}
                    </div>
                  </div>
                </a>
              </TableCell>
              <TableCell className="text-nowrap">
                {unlock.createdAt.toDateString()}
              </TableCell>
              <TableCell align="right">
                <Button
                  variant="outline"
                  onClick={() => onDeleteUnlock(unlock.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
