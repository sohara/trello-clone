"use client";

import { signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const LoginButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() =>
        signIn("github", {
          callbackUrl: "http://localhost:3000",
        })
      }
    >
      <GitHubLogoIcon />
    </Button>
  );
};

export const LogoutButton = () => {
  return (
    <Button
      variant="outline"
      onClick={() =>
        signOut({
          callbackUrl: "http://localhost:3000",
        })
      }
    >
      Logout{" "}
    </Button>
  );
};
