// KanbanBoard page component for displaying and managing a Kanban board UI
// Loads board data from backend, groups by DB status strings, and renders columns

import React, { useCallback, useEffect, useState } from "react";
import KanbanColumn from "../../components/KanbanBoardComponents/boardcolumn.jsx";
import "./board.css";
import { addToken } from "../../HelperFunctions/addtoken";
import Layout from "../../components/PageLayouts/pagelayout"; 
import { addProject } from "../../HelperFunctions/addprojectid.js";

const API_URL = import.meta.env.VITE_API_URL;

//  exact status labels stored in DB is used here :
const DB_STATUSES = ["In Backlog", "In Development", "In Test", "Completed"];

// Initial empty board data 
const initialData = {
  "In Backlog": [],
  "In Development": [],
  "In Test": [],
  "Completed": [],
};

// Column metadata: id === DB status string,usinf the exact DB status string
const columnsMeta = [
  { id: "In Backlog", name: "In Backlog" },
  { id: "In Development", name: "In Development" },
  { id: "In Test", name: "In Test" },
  { id: "Completed", name: "Completed" },
];

export default function KanbanBoard() {
  const [cols, setCols] = useState(initialData);
  const [loading, setLoading] = useState(true);

  // Helper: normalise whatever the backend returns into our 4 arrays.
  // Works if backend returns a FLAT array [{id,title,status}, ...] OR a GROUPED object.
  const toBoard = (data) => {
    const empty = DB_STATUSES.reduce((acc, s) => {
      acc[s] = [];
      return acc;
    }, {});

    if (Array.isArray(data)) {
      // Flat list → group by status
      for (const r of data) {
        if (DB_STATUSES.includes(r.status)) {
          empty[r.status].push({ id: r.id, title: r.title });
        }
      }
      return empty;
    }

    // Grouped object → ensure all keys exist
    for (const s of DB_STATUSES) {
      empty[s] = Array.isArray(data[s]) ? data[s] : [];
    }
    return empty;
  };

  // Load initial board data from backend API on mount
  useEffect(() => {
    (async () => {
      
      try {
        const res = await fetch(`${API_URL}/api/board`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            //Using the function from helper function "addtoken.js" below, we are adding the JWT token to the request 
            ...addToken(),
            ...addProject(),
          },
          //body: JSON.stringify({}), 
        });
        if (!res.ok) throw new Error(`Failed to load board: ${res.status}`);
        const data = await res.json();
        setCols(toBoard(data));
      } catch (e) {
        console.error(e);
        setCols(initialData); // still render empty columns
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Move a card between columns (UI only; persistence handled by Card/Column)
  const moveCard = useCallback(({ fromCol, fromIndex, toCol, toIndex }) => {
    if (fromCol === toCol && (toIndex === fromIndex || toIndex === fromIndex + 1)) return;

    setCols((prev) => {
      const next = {
        ...prev,
        [fromCol]: [...prev[fromCol]],
        [toCol]: [...prev[toCol]],
      };
      const [moved] = next[fromCol].splice(fromIndex, 1);
      const safeIndex = Math.max(0, Math.min(toIndex, next[toCol].length));
      next[toCol].splice(safeIndex, 0, moved);
      return next;
    });
  }, []);

  if (loading) {
    return <div className="kb-loading">Loading board…</div>;
  }

  return (
    <Layout>
    <div className="kb-root">
      {columnsMeta.map((c) => (
        <KanbanColumn
          key={c.id}
          columnId={c.id}     
          title={c.name}
          items={cols[c.id]}  // bracket access works with spaces
          moveCard={moveCard}
        />
      ))}
    </div>
    </Layout>
  );
}
