import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Card as CardModel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AddListButton } from "./_components/add-list-button";
import { ListView } from "./_components/list";

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
      lists: true,
      cards: true,
    },
  });
  if (!board) {
    return <h1>Board not found</h1>;
  }

  const listMap = new Map<string, CardModel[]>();

  for (const card of board.cards) {
    if (!listMap.has(card.listId)) {
      listMap.set(card.listId, [card]);
    } else {
      listMap.get(card.listId)?.push(card);
    }
  }

  async function createList(title: string) {
    "use server";
    if (!board) return;
    await prisma.list.create({ data: { title, boardId: board?.id } });
    console.log("created");
    revalidatePath("/boards/[id]");
  }

  return (
    <main className="p-4 flex flex-col gap-4 h-full relative">
      <h1 className="text-3xl font-semibold">{board?.title}</h1>
      <div className="flex space-x-4 items-start min-h-0 h-full" id="lists">
        {board?.lists.map((list) => (
          <ListView
            key={list.id}
            list={list}
            cards={listMap.get(list.id) ?? []}
            boardId={board.id}
          />
        ))}
        <AddListButton createList={createList} />
      </div>
    </main>
  );
}
