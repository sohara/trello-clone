"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createBoard } from "../actions";

export function CreateBoardDialog() {
  const [name, setName] = useState("");
  const router = useRouter();
  async function handleSubmit() {
    const board = await createBoard(name);
    console.log({ board });
    if (board) {
      router.push(`/boards/${board.id}`);
    }
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Create new board</Button>
      </DialogTrigger>
      <DialogContent className="bg-popover sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create board</DialogTitle>
          <DialogDescription>
            Choose a name for your board. Click save when you’re done.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
