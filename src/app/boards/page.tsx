import { PrismaClient } from "@prisma/client";
import { getCurrentUser } from "../../lib/session";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateBoardForm } from "./_components/create-board-form";
import { revalidatePath } from "next/cache";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient({ log: ["query"] });

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
  async function createBoard(name: string) {
    "use server";
    console.log({ user });
    if (!user) return;
    await prisma.board.create({ data: { title: name, userId: user?.id } });
    revalidatePath("/boards");
  }
  return (
    <main className="px-8 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">Boards</h1>
      <div className="flex space-x-4">
        {boards.map((board) => (
          <Card key={board.id} className="w-[250px]">
            <CardHeader>
              <CardTitle>{board.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">Create new board</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create board</DialogTitle>
              <DialogDescription>
                Choose a name for your board. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <CreateBoardForm createBoard={createBoard} />
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}
