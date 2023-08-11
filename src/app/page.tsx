import { Button } from "@/components/ui/button";
import { ModeToggle } from "../components/mode-toggle";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Hello World
      </h1>
      <Button>Click Me</Button>
      <ModeToggle />
    </main>
  );
}
