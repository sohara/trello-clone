import { Button } from "@/components/ui/button";
import { ModeToggle } from "../components/mode-toggle";
import { LoginButton, LogoutButton } from "../components/auth-buttons";
import { getServerSession } from "next-auth";
import { nextAuthOptions } from "./api/auth/[...nextauth]/route";
import Image from "next/image";

async function getSession() {
  return await getServerSession(nextAuthOptions);
}

async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export default async function Home() {
  const user = await getCurrentUser();
  console.log(user);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Hello World
      </h1>
      <Button>Click Me</Button>
      {user ? (
        <>
          <p>Logged in as {user.name}</p>
          <Image
            className="rounded-full"
            src={user.image ?? ""}
            alt="user avatar"
            height={52}
            width={52}
          />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
      <ModeToggle />
    </main>
  );
}
