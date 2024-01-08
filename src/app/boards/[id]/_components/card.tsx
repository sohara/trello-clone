import { Card } from "@prisma/client";
import { TrashIcon } from "@radix-ui/react-icons";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { flushSync } from "react-dom";

export function CardView({
  card,
  dragPreviewHeight,
  nextOrder,
  previousOrder,
  onDropCard,
  currentDragId,
  setCurrentDragId,
  setDragPreviewHeight,
  onDelete,
}: {
  card: Card;
  dragPreviewHeight: number;
  previousOrder: number;
  nextOrder: number;
  onDropCard: (id: string, order: number) => void;
  currentDragId: string;
  setCurrentDragId: Dispatch<SetStateAction<string>>;
  setDragPreviewHeight: Dispatch<SetStateAction<number>>;
  onDelete: (id: string) => void;
}) {
  // const [dragging, setDragging] = useState(false);
  const [showDropPreview, setShowDropPreview] = useState(false);
  const dragCounter = useRef(0);

  function onDragStart(e: React.DragEvent<HTMLDivElement>) {
    e.dataTransfer.setData("cardId", card.id);
    // e.dataTransfer.effectAllowed = "move";
    // setDragging(true);
    console.log({ draggingId: card.id });
    setCurrentDragId(card.id);

    // Get drag height to set for other placeholders
    const rect = e.currentTarget.getBoundingClientRect();
    const height = rect.bottom - rect.top;
    console.log({ top: rect.top, bottom: rect.bottom, height });
    setDragPreviewHeight(height);

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

  return (
    <li
      className={`py-1 text-sm `}
      key={card.id}
      id={card.id}
      onDragEnter={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current++;
        if (dragCounter.current === 1 && currentDragId !== card.id) {
          console.log("enter", card.title);
          setShowDropPreview(true);
        }
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        dragCounter.current--;
        if (dragCounter.current === 0 && currentDragId !== card.id) {
          console.log("leave", card.title);
          setShowDropPreview(false);
        }
      }}
      // onDragOver={() => console.log("over")}
      onDrop={(event) => {
        event.stopPropagation();
        const cardId = event.dataTransfer.getData("cardId");
        const rect = event.currentTarget.getBoundingClientRect();
        const midpoint = (rect.top + rect.bottom) / 2;
        const dropTarget = event.clientY <= midpoint ? "top" : "bottom";
        const droppedOrder = dropTarget === "top" ? previousOrder : nextOrder;
        const newOrder = (droppedOrder + card.order) / 2;
        console.log({
          cardId,
          nextOrder,
          previousOrder,
          midpoint,
          dropTarget,
          newOrder,
        });
        flushSync(() => {
          setShowDropPreview(false);
          onDropCard(cardId, newOrder);
        });
      }}
    >
      {showDropPreview && (
        <div
          className="bg-gray-300 rounded-lg mb-2"
          style={{ height: dragPreviewHeight }}
        />
      )}
      <div
        className="bg-white p-2 rounded-lg shadow-md cursor-grab active:cursor-grabbing flex justify-between gap-2"
        draggable
        onDragStart={onDragStart}
        data-card-id={card.id}
      >
        <h3>
          {card.title} - {card.order}
        </h3>
        <button
          onClick={() => {
            onDelete(card.id);
          }}
        >
          <TrashIcon />
        </button>
      </div>
    </li>
  );
}
