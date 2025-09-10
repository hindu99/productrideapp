// pages/Backlog/backlogpage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/PageLayouts/pagelayout";
import { addToken } from "../../HelperFunctions/addtoken";
import { addProject } from "../../HelperFunctions/addprojectid.js";

import "./backloghomepage.css";

export default function BackloghomePage() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

        </header>

        {loading && <div className="muted">Loading…</div>}
        {error && <div className="error-text">{error}</div>}

        {!loading && !error && (
          <div className="backlog-table">
          <h2 className="backlog-title">Backlog</h2>
            <div className="backlog-row backlog-row--head">
              <div className="col col-title">Title</div>
              <div className="col col-sprint">Sprint</div>
              <div className="col col-rice">RICE</div>
            </div>

            {items.map((item) => (
              <div
                className="backlog-row backlog-row--clickable"
                key={item.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/requirementpage/${item.id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/requirementpage/${item.id}`);
                  }
                }}
              >
                <div className="col col-title">{item.title}</div>
                <div className="col col-sprint">{item.sprint ?? "-"}</div>
                <div className="col col-rice">
                  {Number.isFinite(item.riceScore) ? item.riceScore.toFixed(2) : "—"}
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </Layout>
  );
}
