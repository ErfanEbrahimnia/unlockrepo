"use client";

import { use, useTransition } from "react";
import type { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Github, LoaderCircle, ShoppingCart } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form";
import { createUnlock } from "./_actions/create_unlock";
import { Combobox } from "@/app/_components/combobox";
import { Button } from "@/app/_components/ui/button";
import { unlockCreateSchema } from "./schemas";
import type { GithubRepository } from "@/unlockrepo/github/github_client";
import type { MerchantProduct } from "@/unlockrepo/merchant/merchant_client";
import { Link } from "@/app/_components/ui/link";
import { withErrorHandling } from "@/app/_libs/actions";
import { toast } from "@/app/_components/ui/sonner";

export function NewUnlockForm({
  repositoriesPromise,
  productsPromise,
}: {
  repositoriesPromise: Promise<GithubRepository[]>;
  productsPromise: Promise<MerchantProduct[]>;
}) {
  const repositories = use(repositoriesPromise);
  const products = use(productsPromise);
  const [pending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof unlockCreateSchema>>({
    resolver: zodResolver(unlockCreateSchema),
    defaultValues: {
      repositoryId: "",
      productId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof unlockCreateSchema>) {
    startTransition(() =>
      withErrorHandling(
        createUnlock(values).then(() => toast.success("New Unlock created"))
      )
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-5 text-center">
        Unlock a new repository
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 w-[320px]"
        >
          <FormField
            control={form.control}
            name="productId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center mb-1">
                  <ShoppingCart size={18} className="mr-1" />
                  Product
                </FormLabel>
                <FormControl>
                  <Combobox
                    triggerClassName="w-full"
                    value={field.value}
                    disabled={pending}
                    placeholder="Select a product"
                    emptyMessage="No products available"
                    onChange={field.onChange}
                    items={products.map((product) => ({
                      value: product.id,
                      label: product.name,
                    }))}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Purchasing this product grants the customer access to the
                  repository.
                </FormDescription>
              </FormItem>
            )}
          />
          <UnlockDivider />
          <FormField
            control={form.control}
            name="repositoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center mb-1">
                  <Github size={18} className="mr-1" />
                  Repository
                </FormLabel>
                <FormControl>
                  <Combobox
                    triggerClassName="w-full"
                    value={field.value}
                    disabled={pending}
                    placeholder="Select a Github repository"
                    emptyMessage="No Github repositories available"
                    onChange={field.onChange}
                    items={repositories.map((repository) => ({
                      value: String(repository.id),
                      label: repository.name,
                    }))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-x-3 justify-end">
            <Button asChild type="button" variant="ghost" className="self-end">
              <Link href="/dashboard">Cancel</Link>
            </Button>
            <Button type="submit" disabled={pending} className="self-end w-28">
              {pending ? (
                <LoaderCircle size={16} className="animate-spin" />
              ) : (
                "Save"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function UnlockDivider() {
  return (
    <div className="flex flex-col items-center gap-y-2">
      <div className="h-10 border-l-4 border-dotted" />
      🔓
      <div className="h-10 border-l-4 border-dotted" />
    </div>
  );
}
