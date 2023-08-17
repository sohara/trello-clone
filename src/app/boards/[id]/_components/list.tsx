"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AddCardButton } from "./add-card-button";
import { Card as CardModel, List } from "@prisma/client";

export function ListView({
  createCard,
  list,
}: {
  createCard: (name: string, list: string) => Promise<void>;
  list: List & { cards: CardModel[] };
}) {
  const [draggedCard, setDraggedCard] = useState("");
  const [cards, setCards] = useState(list.cards);
  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("cardId", e.currentTarget.id);
    setDraggedCard(e.currentTarget.id);
    console.log({ draggingId: e.currentTarget.id });
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    // console.log({ over: e, draggedCard });
    e.preventDefault();
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const card = document.getElementById(cardId);
    const dropPointY = e.clientY;
    console.log({ dropPointY });
    const cards = document.querySelectorAll(".card");
    let previousCard: Element | null = null;

    cards.forEach((cardEl) => {
      if (cardEl.getBoundingClientRect().y < dropPointY) {
        previousCard = cardEl;
      }
    });

    if (previousCard) {
      //   previousCard.after(card);
    } else {
      //   cards[0].before(card);
    }
    console.log({ dropped: cardId });
  }
  return (
    <Card
      key={list.id}
      className="w-[250px]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CardHeader>
        <CardTitle>{list.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {list.cards.map((card) => (
          <Card key={card.id} id={card.id} draggable onDragStart={onDragStart}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </CardContent>
      <CardFooter>
        <AddCardButton listId={list.id} createCard={createCard} />
      </CardFooter>
    </Card>
  );
}
