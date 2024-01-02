"use client";

import { useRef, useState } from "react";
import { PlusIcon, Cross1Icon, Cross2Icon } from "@radix-ui/react-icons";
import { createId } from "@paralleldrive/cuid2";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useKeyPress } from "@/lib/use-keypress";
import { Textarea } from "@/components/ui/textarea";

export function AddCardButton({
  createCard,
  listId,
  boardId,
  nextCardOrder,
}: {
  createCard: ({
    id,
    title,
    listId,
    boardId,
  }: {
    id: string;
    title: string;
    listId: string;
    boardId: string;
    order: number;
  }) => Promise<void>;
  listId: string;
  boardId: string;
  nextCardOrder: number;
}) {
  const [formShowing, setFormShowing] = useState(false);
  useKeyPress("Escape", () => setFormShowing(false));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  function handleSubmit(formData: FormData) {
    const id = createId();
    console.log({ id });
    createCard({
      id,
      title: formData.get("title") as string,
      listId,
      boardId,
      order: nextCardOrder,
    });
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    // setFormShowing(false);
    //
  }

  return (
    <div className="flex flex-col gap-2 py-4 px-2">
      {formShowing ? (
        <form action={handleSubmit}>
          <div className="flex flex-col gap-3">
            <Textarea
              className="bg-white shadow-gray-400 shadow-sm"
              placeholder="Enter list title"
              name="title"
              autoFocus
              ref={textareaRef}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitButtonRef.current?.click();
                }
              }}
            />
            <div className="flex items-center gap-2">
              <Button
                type="submit"
                className="font-semibold"
                ref={submitButtonRef}
              >
                Add card
              </Button>
              <Button
                variant={"ghost"}
                className="hover:bg-gray-300 px-2"
                onClick={() => setFormShowing(false)}
                aria-label="Close"
                title="Close"
              >
                <Cross2Icon width="20" height="20" />
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <Button
          variant="ghost"
          className="w-full hover:bg-gray-300 justify-start"
          onClick={() => {
            setFormShowing(true);
          }}
        >
          <PlusIcon className="mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
}
