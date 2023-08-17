import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { AddListButton } from "./_components/add-list-button";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCardButton } from "./_components/add-card-button";
import { ListView } from "./_components/list";

// TODO: Add closing of form on escape key press
export default async function Boards({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/auth");
  }
  const board = await prisma.board.findFirst({
    where: {
      id: params.id,
    },
    include: {
      lists: {
        include: { cards: true },
      },
    },
  });
  async function createList(title: string) {
    "use server";
    if (!board) return;
    await prisma.list.create({ data: { title, boardId: board?.id } });
    console.log("created");
    revalidatePath("/boards/[id]");
  }

  async function createCard(title: string, listId: string) {
    "use server";
    await prisma.card.create({ data: { title, listId } });
    console.log("created");
    revalidatePath("/boards/[id]");
  }

  return (
    <main className="px-8 flex flex-col gap-4">
      <h1 className="text-3xl font-semibold">{board?.title}</h1>
      <div className="flex space-x-4 items-start" id="lists">
        {board?.lists.map((list) => (
          <ListView key={list.id} list={list} createCard={createCard} />
        ))}
        <AddListButton createList={createList} />
      </div>
    </main>
  );
}
