"use client";

import { useState } from "react";
import { PlusIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AddListButton({
  createList,
}: {
  createList: (name: string) => Promise<void>;
}) {
  const [formShowing, setFormShowing] = useState(false);

  function handleSubmit(formData: FormData) {
    createList(formData.get("title") as string);
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
          Create new list
        </Button>
      )}
    </Card>
  );
}
