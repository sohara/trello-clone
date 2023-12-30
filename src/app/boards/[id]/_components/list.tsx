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
  boardId,
  cards,
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
  list: List;
  boardId: string;
  cards: CardModel[];
}) {
  const [draggedCard, setDraggedCard] = useState("");
  const [orderedCards, setOrderedCards] = useState(cards);
  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("cardId", e.currentTarget.id);
    setDraggedCard(e.currentTarget.id);
    console.log({ draggingId: e.currentTarget.id });
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    // console.log({ over: e, draggedCard });
    e.preventDefault();
  }
  const nextCardOrder =
    (cards
      .map((c) => c.order)
      .sort((a, b) => a - b)
      .pop() ?? 1) + 1;

  console.log({ nextCardOrder });

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const cardId = e.dataTransfer.getData("cardId");
    const droppedCardEl = document.getElementById(cardId);
    if (!droppedCardEl) {
      return;
    }
    const dropPointY = e.clientY;
    console.log({ dropPointY });
    let previousCard: Element | undefined;

    const cardEls = cards.map((card) => document.getElementById(card.id));
    cardEls.forEach((cardEl) => {
      if (cardEl && cardEl.getBoundingClientRect().y < dropPointY) {
        previousCard = cardEl;
      }
    });

    if (previousCard) {
      previousCard.after(droppedCardEl);
    } else {
      const firstCardEl = cardEls[0];
      if (firstCardEl) {
        firstCardEl.before(droppedCardEl);
      }
    }
    const orderedCards = cards
      .slice(0)
      .map((c) => {
        const el = document.getElementById(c.id);
        return { ...c, positionY: el?.getBoundingClientRect()?.y };
      })
      .sort((a, b) => (a.positionY ?? 0) - (b.positionY || 0))
      .map((c) => {
        const { positionY, ...rest } = c;
        return rest;
      });
    console.log({ orderedCards });
    setOrderedCards(orderedCards);

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
        {cards.map((card) => (
          <Card key={card.id} id={card.id} draggable onDragStart={onDragStart}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </CardContent>
      <CardFooter>
        <AddCardButton
          listId={list.id}
          boardId={boardId}
          createCard={createCard}
          nextCardOrder={nextCardOrder}
        />
      </CardFooter>
    </Card>
  );
}
