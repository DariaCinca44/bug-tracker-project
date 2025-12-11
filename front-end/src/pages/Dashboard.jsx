import React, { useState } from "react";
import "../styles/Dashboard.css";

function Dashboard() {

  // MOCK PROJECTS
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Project Alpha",
      description: "Authentication module refactor.",
      repositoryUrl: "https://github.com/test/project-alpha",
    },
    {
      id: 2,
      name: "Project Beta",
      description: "UI redesign and components.",
      repositoryUrl: "https://github.com/test/project-beta",
    },
    {
      id: 3,
      name: "Project Gamma",
      description: "API performance improvements.",
      repositoryUrl: "https://github.com/test/project-gamma",
    },
  ]);

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
  <h3 className="sidebar-title">PROJECTS</h3>

  {/* LISTA PROIECTELOR */}
  <div className="sidebar-projects">
    {projects.map((project) => (
      <button
        key={project.id}
        className="sidebar-project-btn"
        onClick={() => (window.location.href = `/project/${project.id}`)}
      >
        {project.name}
      </button>
    ))}
  </div>

  {/* FORMULAR JOS */}
  <div className="sidebar-bottom">
    <form
      className="sidebar-add-form"
      onSubmit={(e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const repo = e.target.repo.value;

        const newProject = {
          id: projects.length + 1,
          name,
          description: "New project added",
          repositoryUrl: repo,
        };

        setProjects([...projects, newProject]);
        e.target.reset();
      }}
    >
      <input name="name" placeholder="Project Name" required />
      <input name="repo" placeholder="Repository URL" required />
      <button type="submit">+ Add Project</button>
    </form>
  </div>
</aside>


      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1 className="main-title">Dashboard</h1>

        

        {/* PROJECT CARDS */}
        <div className="projects-grid">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-card"
              onClick={() => (window.location.href = `/project/${project.id}`)}
            >
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              <span className="project-repo">{project.repositoryUrl}</span>
            </div>
          ))}
        </div>
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">

        {/* USER XP BOX */}
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

        {/* NOTIFICATIONS */}
        <div className="notifications-box">
          <h3 className="notif-title">Notifications</h3>
          <div className="notif-item">New bug reported</div>
          <div className="notif-item">Bug resolved</div>
          <div className="notif-item">Bug reopened</div>
        </div>
      </aside>
    </div>
  );
}

export default Dashboard;
