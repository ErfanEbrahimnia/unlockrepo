import { Footer } from "@/app/_components/footer";
import { Container } from "@/app/_components/ui/container";

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <main>
        <Container>{children}</Container>
      </main>
      <Footer className="absolute bottom-2 w-full" />
    </div>
  );
}
