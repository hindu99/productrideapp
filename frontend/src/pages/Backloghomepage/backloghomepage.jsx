// pages/Backlog/backlogpage.jsx
import React, { useEffect, useState } from "react";
import Layout from "../../components/PageLayouts/pagelayout";
import { addToken } from "../../HelperFunctions/addtoken";
import { addProject } from "../../HelperFunctions/addprojectid.js";

import "./backloghomepage.css";

export default function BackloghomePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      //Request to the server for getting the backlog items 
      try {
        const res = await fetch("http://localhost:5000/api/backlog", {
          headers: {
            "Content-Type": "application/json",
            ...addToken(),
            ...addProject(),
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Could not load,please try again");
        setItems(data); 
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <div className="backlog-container">
        <header className="backlog-header">
          <h2>Backlog</h2>
        </header>

        {loading && <div className="muted">Loading…</div>}
        {error && <div className="error-text">{error}</div>}

        {!loading && !error && (
          <div className="backlog-table">
            <div className="backlog-row backlog-row--head">
              <div className="col col-title">Title</div>
              <div className="col col-sprint">Sprint</div>
              <div className="col col-rice">RICE</div>
            </div>

            {items.map((it) => (
              <div className="backlog-row" key={it.id}>
                <div className="col col-title">{it.title}</div>
                <div className="col col-sprint">{it.sprint ?? "-"}</div>
                <div className="col col-rice">
                  {Number.isFinite(it.riceScore) ? it.riceScore.toFixed(2) : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
} 
