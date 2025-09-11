// KanbanColumn component: renders a column and makes the column body a drop target
// When you drop a card onto the column background (not on a card), it appends to the end.

import React, { memo, useEffect, useRef } from "react";
import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import KanbanCard from "./boardcard.jsx";
import "./boardcolumn.css";
import { addToken } from "../../HelperFunctions/addtoken";

const API_URL = import.meta.env.VITE_API_URL;

function KanbanColumn({ columnId, title, items, moveCard }) {
  const columnRef = useRef(null);

  // Make the column background a drop target (append to end)
  useEffect(() => {
    if (!columnRef.current) return;

    // Register the column body as a drop target
    return dropTargetForElements({
      element: columnRef.current,
      canDrop: ({ source }) => source.data?.type === "card",
      getIsSticky: () => true,
      getData: () => ({ type: "column", columnId }),

      // When a card is dropped onto the column background (not on a card)
      onDrop: async ({ source }) => {
        if (source.data?.type !== "card") return;

        const fromCol = source.data.fromCol;
        const fromIndex = source.data.index;
        const toCol = columnId;

        // Append at end of this column.
        // NOTE: Using items.length here is fine because the drop target re-registers when items.length changes.
        // const toIndex = columnRef.current?.querySelectorAll('[data-card-id]').length ?? items.length;
        const toIndex = items.length;

        // updating Optimistic UI 
        moveCard({ fromCol, fromIndex, toCol, toIndex });

        // Persist to backend
        // Note: persistence for card→card drops is handled in KanbanCard's onDrop.
        // For column background drops, we persist here because the column is the drop target .
        try {
          const response = await fetch(`${API_URL}/api/cardposition`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              //Using the function from helper function "addtoken.js" below, we are adding the JWT token to the request 
              ...addToken(),
            },
            body: JSON.stringify({
              id: source.data.id,
              status: toCol,
              // position: toIndex, // not using position for the timebeing will be used in future
            }),
          });
         // const data = await response.json();
          if (!response.ok) throw new Error(`Save failed: ${response.status}`);
        } catch (err) {
          console.error(err);

          // Rollback on failure 
          moveCard({
            fromCol: toCol,
            fromIndex: toIndex,
            toCol: fromCol,
            toIndex: fromIndex,
          });
        }
      },
    });
  }, [columnId, items.length, moveCard]);

  return (
    <div className="kb-column">
      <div className="kb-column-header">{title}</div>
      <div className="kb-column-body" ref={columnRef}>
        {items.map((item, idx) => (
          <KanbanCard
            key={item.id}
            item={item}
            index={idx}
            fromCol={columnId}
            moveCard={moveCard}
    
          />
        ))}
      </div>
    </div>
  );
}

export default memo(KanbanColumn);
