import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../../lib/session";
import { CreateBoardDialog } from "./_components/create-board-dialog";

export default async function Boards() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }
  const boards = await prisma.board.findMany({
    where: {
      userId: user?.id,
    },
  });

  return (
    <main className="p-4 flex flex-col gap-4 h-full relative">
      <h1 className="text-3xl font-semibold">Boards</h1>
      <div className="grid  grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link href={`/boards/${board.id}`} key={board.id}>
            <Card key={board.id} className="w-[250px]">
              <CardHeader>
                <CardTitle>{board.title}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      <div>
        <CreateBoardDialog />
      </div>
    </main>
  );
}
