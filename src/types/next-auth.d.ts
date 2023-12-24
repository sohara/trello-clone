import type { User } from "next-auth";

type UserId = string;

declare module "@auth/core/jwt" {
  interface JWT {
    id: UserId;
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: UserId;
    };
  }
}
