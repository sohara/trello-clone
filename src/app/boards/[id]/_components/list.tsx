"use client";

import { createId } from "@paralleldrive/cuid2";
import { Card, List } from "@prisma/client";
import { useOptimistic, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { updateList } from "../../actions";
import { createCard } from "../actions";
import { AddCardButton } from "./add-card-button";
import { EditableText } from "./editable-text";

export function ListView({
  list,
  boardId,
  cards,
}: {
  list: List;
  boardId: string;
  cards: Card[];
}) {
  const [draggedCard, setDraggedCard] = useState("");
  const listRef = useRef<HTMLOListElement>(null);

  const [optimisticCards, addOptimisticCard] = useOptimistic<Card[], Card>(
    cards,
    (state: Card[], newCard: Card) => [...state, newCard],
  );

  const sortedOptimisticCards = optimisticCards.sort(
    (a, b) => a.order - b.order,
  );

  const nextCardOrder =
    (sortedOptimisticCards.map((c) => c.order).pop() ?? 1) + 1;

  async function onAddCard(title: string) {
    const id = createId();
    console.log({ id });
    const newCard: Card = {
      id,
      description: "",
      title,
      listId: list.id,
      boardId,
      order: nextCardOrder,
    };
    // Need to use `flushSync` so that render happens before getting
    // current scrollHeight
    flushSync(() => {
      addOptimisticCard(newCard);
    });
    scrollToBottom();
    await createCard(newCard);
  }

  function scrollToBottom() {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    // console.log({ over: e, draggedCard });
    e.preventDefault();
  }

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
    // setOrderedCards(orderedCards);

    console.log({ dropped: cardId });
  }
  return (
    <div
      key={list.id}
      className="flex flex-col w-[250px] bg-gray-100 rounded-xl shadow-gray-400 shadow-lg max-h-full overflow-hidden flex-shrink-0"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <EditableText
        text={list.title}
        onSubmit={(value) => {
          updateList({ ...list, title: value });
        }}
      />
      <ol
        className="flex flex-col flex-grow gap-2 py-4 px-2 max-h-full overflow-auto"
        ref={listRef}
      >
        {sortedOptimisticCards.map((card) => (
          <CardView card={card} key={card.id} />
        ))}
      </ol>
      <AddCardButton onAddCard={onAddCard} onFormShowing={scrollToBottom} />
    </div>
  );
}

function CardView({ card }: { card: Card }) {
  const [dragging, setDragging] = useState(false);
  function onDragStart(e: React.DragEvent<HTMLLIElement>) {
    e.dataTransfer.setData("cardId", e.currentTarget.id);
    e.dataTransfer.effectAllowed = "move";
    setDragging(true);
    console.log({ draggingId: e.currentTarget.id });

    // Clone the original element so the drag image can be styled
    // TODO: See if there's a way to do this programmiatically while
    // setting the native drag image to nothing. Rotation styles don't
    // seem to work with native elements
    // const originalNode = e.currentTarget as HTMLLIElement;
    // const clone = originalNode.cloneNode(true) as HTMLLIElement;
    // clone.style.width = `${originalNode.clientWidth}px`;
    // clone.style.height = `${originalNode.clientHeight}px`;
    // clone.style.transform = "rotate(4deg)";
    // clone.style.listStyle = "none";
    // clone.style.cursor = "grabbing";
    // document.body.appendChild(clone);
    // e.dataTransfer.setDragImage(clone, 50, 50);
  }

  function onDragEnd(e: React.DragEvent<HTMLLIElement>) {
    setDragging(false);
  }

  return (
    <li
      className={`bg-white p-2 rounded-lg shadow-md text-sm ${
        dragging ? "rotate-2" : ""
      }`}
      key={card.id}
      id={card.id}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
    >
      <h3>{card.title}</h3>
    </li>
  );
}
