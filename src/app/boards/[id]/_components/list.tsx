"use client";

import { createId } from "@paralleldrive/cuid2";
import { Card, List } from "@prisma/client";
import { useReducer, useRef, useState, useTransition } from "react";
import { flushSync } from "react-dom";
import { updateList } from "../../actions";
import { createCard, deleteCard, updateCard } from "../actions";
import { AddCardButton } from "./add-card-button";
import { CardView } from "./card";
import { EditableText } from "./editable-text";

type OptimisticAdd = {
  type: "ADD";
  payload: Card;
};

type OptimisticUpdate = {
  type: "UPDATE";
  payload: { id: string; order: number };
};

type OptimisticDelete = {
  type: "DELETE";
  payload: { id: string };
};

type Action = OptimisticAdd | OptimisticUpdate | OptimisticDelete;

function reducer(state: Card[], { type, payload }: Action) {
  switch (type) {
    case "ADD":
      return [...state, payload];
    case "UPDATE":
      console.log("UPDATING", { state, payload });
      // const [_, ...rest] = state;
      return state.map((c) =>
        c.id === payload.id ? { ...c, order: payload.order } : c,
      );
    case "DELETE":
      return state.filter((c) => c.id !== payload.id);
    default:
      console.log("doing default");
      return state;
  }
}

export function ListView({
  list,
  boardId,
  cards,
}: {
  list: List;
  boardId: string;
  cards: Card[];
}) {
  const listRef = useRef<HTMLOListElement>(null);
  const [_, startTransition] = useTransition();
  const [currentDragId, setCurrentDragID] = useState("");
  const [optimisticCards, dispatch] = useReducer(reducer, cards);
  const [dragPreviewHeight, setDragPreviewHeight] = useState(0);

  const sortedOptimisticCards = optimisticCards.sort(
    (a, b) => a.order - b.order,
  );
  console.log({ sortedOptimisticCards });

  const nextCardOrder =
    (sortedOptimisticCards.map((c) => c.order).pop() ?? 1) + 1;

  async function onAddCard(title: string) {
    const id = createId();
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
      // setOptimisticCards({ action: "ADD", payload: newCard });
      dispatch({ type: "ADD", payload: newCard });
    });
    scrollToBottom();
    await createCard(newCard);
  }

  async function onDropCard(id: string, order: number) {
    startTransition(() => {
      dispatch({ type: "UPDATE", payload: { id, order } });
    });
    await updateCard(id, { order });
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

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    const id = e.dataTransfer.getData("cardId");
    // TODO: Accept cards from other lists. Also if list already has
    // elements, figure out based on drop position whether we should prepend ]
    // or append this card to the list
    const order = 1;
    dispatch({ type: "UPDATE", payload: { id, order } });
    updateCard(id, { order });
  }

  function onDelete(id: string) {
    dispatch({ type: "DELETE", payload: { id } });
    deleteCard(id);
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
        className="flex flex-col flex-grow px-2 max-h-full overflow-auto pb-2"
        ref={listRef}
      >
        {sortedOptimisticCards.map((card, index, cards) => (
          <CardView
            card={card}
            dragPreviewHeight={dragPreviewHeight}
            key={card.id}
            previousOrder={cards[index - 1] ? cards[index - 1].order : 0}
            nextOrder={
              cards[index + 1] ? cards[index + 1].order : card.order + 1
            }
            onDropCard={onDropCard}
            currentDragId={currentDragId}
            setCurrentDragId={setCurrentDragID}
            setDragPreviewHeight={setDragPreviewHeight}
            onDelete={onDelete}
          />
        ))}
      </ol>
      <AddCardButton onAddCard={onAddCard} onFormShowing={scrollToBottom} />
    </div>
  );
}
