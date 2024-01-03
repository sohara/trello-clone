"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { Board } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createBoard(name: string): Promise<Board | undefined> {
  const user = await getCurrentUser();
  if (!user) return;
  const board = await prisma.board.create({
    data: { title: name, userId: user?.id },
  });
  // TODO: This will probably not be needed wiht optimistic UI
  revalidatePath("/boards");
  return board;
}
