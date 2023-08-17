"use client";

import { useState } from "react";
import { PlusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { List } from "@prisma/client";
import { useKeyPress } from "@/lib/use-keypress";

export function AddCardButton({
  createCard,
  listId,
}: {
  createCard: (name: string, list: string) => Promise<void>;
  listId: string;
}) {
  const [formShowing, setFormShowing] = useState(false);
  useKeyPress("Escape", () => setFormShowing(false));

  function handleSubmit(formData: FormData) {
    createCard(formData.get("title") as string, listId);
    setFormShowing(false);
  }

  return (
    <Card className="w-[250px]">
      {formShowing ? (
        <CardContent>
          <form action={handleSubmit}>
            <Input placeholder="Enter list title" name="title" autoFocus />
            <div className="flex items-center">
              <Button>Add list</Button>
              <Button variant={"ghost"} onClick={() => setFormShowing(false)}>
                <Cross1Icon />
              </Button>
            </div>
          </form>
        </CardContent>
      ) : (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => {
            setFormShowing(true);
          }}
        >
          <PlusIcon className="mr-2" />
          Add a card
        </Button>
      )}
    </Card>
  );
}