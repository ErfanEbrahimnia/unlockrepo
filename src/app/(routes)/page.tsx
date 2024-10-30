import { HeaderBar } from "@/app/_components/header_bar";
import { Hero } from "./hero";

export default async function Home() {
  return (
    <div>
      <main>
        <HeaderBar />
        <Hero />
      </main>
      <footer></footer>
    </div>
  );
}
