import { Footer } from "@/app/_components/footer";
import { HeaderBar } from "@/app/_components/header_bar";
import { Container } from "@/app/_components/ui/container";
import { Toaster } from "@/app/_components/ui/sonner";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col justify-between h-screen">
      <main>
        <div className="mb-6">
          <Container>
            <HeaderBar />
          </Container>
        </div>
        <Container>{children}</Container>
      </main>
      <Toaster />
      <Footer />
    </div>
  );
}
