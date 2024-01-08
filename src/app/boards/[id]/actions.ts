"use server";

import { prisma } from "@/lib/prisma";
import { Card } from "@prisma/client";
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
  await prisma.card.create({ data: { id, title, listId, boardId, order } });
  console.log("created");
  revalidatePath("/boards/[id]");
}

export async function updateCard(id: string, data: Partial<Card>) {
  const result = await prisma.card.update({
    where: { id },
    data,
  });
  console.log({ result });
  revalidatePath("/boards/[id]");
}

export async function deleteCard(id: string) {
  const result = await prisma.card.delete({
    where: { id },
  });
  console.log(result);
  revalidatePath("/boards/[id]");
}
