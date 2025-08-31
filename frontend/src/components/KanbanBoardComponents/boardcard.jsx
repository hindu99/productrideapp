// KanbanBoard Card component for displaying individual task or item cards
// Handles rendering of card content and drag-and-drop logic if implemented
// Receives props from parent KanbanColumn for card data and actions


import React, { memo, useEffect, useRef } from "react";
import {draggable,dropTargetForElements,} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { combine } from "@atlaskit/pragmatic-drag-and-drop/combine";
import {attachClosestEdge,extractClosestEdge,} from "@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge";
import "./boardcard.css";

/**
 * Props:
 * - item: { id, title }
 * - index: number (position in its column)
 * - fromCol: string (column id)
 * - moveCard: ({fromCol, fromIndex, toCol, toIndex}) => void
 */
function KanbanCard({ item, index, fromCol, moveCard }) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!cardRef.current) return;

    // This function makes the card draggable
    const cleanupDraggable = draggable({
      element: cardRef.current,
      getInitialData: () => ({
        type: "card",
        id: item.id,
        fromCol,
        index,
      }),
      onDragStart: () => {
        cardRef.current?.classList.add("kb-card--dragging");
      },
      onDrop: () => {
        cardRef.current?.classList.remove("kb-card--dragging");
      },
    });

    // Make this card a drop target (insert above/below via closest-edge)
    const cleanupDropTarget = dropTargetForElements({
      element: cardRef.current,
      canDrop: ({ source }) => source.data?.type === "card",
      getData: ({ input }) =>
        attachClosestEdge(
          {
            type: "card-target",
            columnId: fromCol,
            index, // index of THIS target card within its column
          },
          { element: cardRef.current, input, allowedEdges: ["top", "bottom"] }
        ),
      onDrop: async ({ self, source }) => {
        if (source.data?.type !== "card") return;

        // workout the destination of the card
         
        const edge = extractClosestEdge(self.data); // "top" | "bottom"
        const toCol = self.data.columnId;
        const targetIndex = self.data.index;
        const toIndex = edge === "bottom" ? targetIndex + 1 : targetIndex;
        

        // Optimistic UI
        moveCard({
          fromCol: source.data.fromCol,
          fromIndex: source.data.index,
          toCol,
          toIndex,
        });

        /* 
        // Persist (disabled because Iam not using position for the time being, it will be implemented in future)
        try {
          const res = await fetch(`/api/requirements/${source.data.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              // Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              status: toCol,
              position: toIndex,
            }),
          });
          if (!res.ok) throw new Error(`Save failed: ${res.status}`);
        } catch (err) {
          console.error(err);
          // Rollback (best-effort)
          moveCard({
            fromCol: toCol,
            fromIndex: toIndex,
            toCol: source.data.fromCol,
            toIndex: source.data.index,
          });
        }
        */
      },
    });

    return () => combine(cleanupDraggable, cleanupDropTarget)();
  }, [item.id, fromCol, index, moveCard]);

  return (
    <div className="kb-card" ref={cardRef} data-card-id={item.id}>
      <div className="kb-card-title">{item.title}</div>
    </div>
  );
}

export default memo(KanbanCard);
