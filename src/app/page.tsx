import { getCurrentUser } from "@/lib/session";
// import { getServerSession } from "next-auth";
// import { nextAuthOptions } from "./api/auth/[...nextauth]/route";
//
// async function getSession() {
//   return await getServerSession(nextAuthOptions);
// }
//
// async function getCurrentUser() {
//   const session = await getSession();
//   return session?.user;
// }

export default async function Home() {
  const user = await getCurrentUser();
  console.log(user);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
        Welcome to Trello
      </h1>
      <h3>Log in to get started</h3>
    </main>
  );
}
