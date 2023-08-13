import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthOptions, DefaultSession } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient({ log: ["query"] });

export const nextAuthOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    }),
  ],
};
const handler = NextAuth(nextAuthOptions);
export { handler as GET, handler as POST };
