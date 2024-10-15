"use client";

import { use } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@/app/_components/combobox";
import { Button } from "@/app/_components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/app/_components/ui/form";
import { createUnlock } from "./_actions/create_unlock";
import type { Repository } from "@/license-repo/github/repository";
import type { Product } from "@/license-repo/merchant/product";

const formSchema = z.object({
  repositoryId: z.string().min(1, { message: "Select a repository" }),
  productId: z.string().min(1, { message: "Select a product" }),
});

export function DashboardView({
  repositoriesPromise,
  productsPromise,
}: {
  repositoriesPromise: Promise<Repository[]>;
  productsPromise: Promise<Product[]>;
}) {
  const repositories = use<Repository[]>(repositoriesPromise);
  const products = use<Product[]>(productsPromise);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repositoryId: "",
      productId: "",
    },
  });

  function onSubmit({ productId, repositoryId }: z.infer<typeof formSchema>) {
    createUnlock({ productId, repositoryId });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="repositoryId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Combobox
                  value={field.value}
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
        <hr className="my-2" />
        <FormField
          control={form.control}
          name="productId"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Combobox
                  value={field.value}
                  onChange={field.onChange}
                  items={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <hr className="my-2" />
        <Button>Create</Button>
      </form>
    </Form>
  );
}
