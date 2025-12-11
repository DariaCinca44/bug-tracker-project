import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/Dashboard.css"; // Folosim același layout pentru fullscreen

function ProjectPage() {
  const { id } = useParams();

  // MOCK BUGS
  const [bugs] = useState([
    {
      id: 1,
      title: "Login error on mobile",
      severity: "High",
      priority: "High",
      status: "Open",
      assignee: null,
    },
    {
      id: 2,
      title: "Navbar alignment issue",
      severity: "Medium",
      priority: "Low",
      status: "In Progress",
      assignee: "Teodora",
    },
  ]);

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h3 className="sidebar-title">PROJECT {id}</h3>

        <button
          className="sidebar-project-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>

        <button
          className="sidebar-add-btn"
          onClick={() => (window.location.href = `/project/${id}/add-bug`)}
        >
          + Add Bug
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1 className="main-title">Project #{id} — Bugs</h1>

        <div className="projects-grid">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className="project-card"
              onClick={() => (window.location.href = `/bug/${bug.id}`)}
            >
              <h3>{bug.title}</h3>
              <p>
                Severity: <strong>{bug.severity}</strong> | Priority:{" "}
                <strong>{bug.priority}</strong>
              </p>
              <p>Status: {bug.status}</p>
              <span className="project-repo">
                Assigned to: {bug.assignee || "Unassigned"}
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">
        <div className="user-box">
          <h3 className="user-name">
            {localStorage.getItem("username") || "User"}
          </h3>
          <p className="user-level">Level 3 — Bug Fixer</p>

          <div className="xp-bar">
            <div className="xp-fill" style={{ width: "40%" }}></div>
          </div>

          <span className="xp-text">60 XP / 200 XP</span>
        </div>

        <div className="notifications-box">
          <h3 className="notif-title">Notifications</h3>
          <div className="notif-item">Bug updated</div>
          <div className="notif-item">New bug assigned to you</div>
          <div className="notif-item">Bug resolved</div>
        </div>
      </aside>
    </div>
  );
}

export default ProjectPage;
