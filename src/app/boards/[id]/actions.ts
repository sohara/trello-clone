"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCard({
  id,
  title,
  listId,
  boardId,
  order,
}: {
  id: string;
  title: string;
  listId: string;
  boardId: string;
  order: number;
}) {
  "use server";
  await prisma.card.create({ data: { id, title, listId, boardId, order } });
  console.log("created");
  revalidatePath("/boards/[id]");
}
