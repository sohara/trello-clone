"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useKeyPress } from "@/lib/use-keypress";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";

export function AddCardButton({
  onAddCard,
  onFormShowing,
}: {
  onAddCard: (text: string) => void;
  onFormShowing: () => void;
}) {
  const [formShowing, setFormShowing] = useState(false);
  useKeyPress("Escape", () => setFormShowing(false));
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  async function handleSubmit(formData: FormData) {
    onAddCard(formData.get("title") as string);
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
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
                  // TODO: Use form submit here instead of button click?
                  // With requestSubmit:
                  // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#programmatic-form-submission
                  submitButtonRef.current?.click();
                }
              }}
              onBlur={() => setFormShowing(false)}
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
            // Don't batch updtaes so caller can get curren scrollheight, etc
            flushSync(() => {
              setFormShowing(true);
            });
            onFormShowing();
          }}
        >
          <PlusIcon className="mr-2" />
          Add a card
        </Button>
      )}
    </div>
  );
}
