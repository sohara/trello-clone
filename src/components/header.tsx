import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { UserDropdown } from "./user-dropdown";
import { getCurrentUser } from "@/lib/session";

export async function Header() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 flex items-center justify-between bg-gray-100 border-gray-400 border-b">
      <div className="px-8">
        <Link href="/" className="text-2xl font-semibold">
          Trello
        </Link>
      </div>
      <nav className="px-4 py-1 flex items-center space-x-4">
        <ModeToggle />
        <UserDropdown user={user} />
      </nav>
    </header>
  );
}
