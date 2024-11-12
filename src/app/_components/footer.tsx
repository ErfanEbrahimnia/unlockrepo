import { Github } from "lucide-react";
import { cn } from "@/app/_libs/utils";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("flex justify-center mt-3", className)}>
      <a
        target="_blank"
        className="p-2 flex items-center justify-center gap-x-1 font-semibold text-gray-800"
        href="https://github.com/ErfanEbrahimnia/unlockrepo"
      >
        <Github fill="currentColor" size={22} />
      </a>
    </footer>
  );
}
