import "./Dashboard.css";

import { useState } from "react";


function ProjectsPage() {
    const [selectedProject, setSelectedProject] = useState("Website App");
    const [projects] = useState(["Mobile App", "Website App", "Internal Tool"]);
      const [bugs] = useState([
    { id: 1, title: "Login button not working", severity: "High", priority: "High", status: "Resolved" },
    { id: 2, title: "Navbar alignment issue", severity: "Medium", priority: "Low", status: "Open" },
    { id: 3, title: "Broken link in footer", severity: "Low", priority: "Low", status: "Resolved" },
  ]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Projects</h2>
        <ul className="project-list">
          {projects.map((proj, index) => (
            <li
              key={index}
              className={`project-item ${proj === selectedProject ? "active" : ""}`}
              onClick={() => setSelectedProject(proj)}
            >
              {proj}
            </li>
          ))}
        </ul>
        <button className="add-project-btn">+ Add Project</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        {/* Header */}
        <div className="user-card">
          <div>
            <h2 className="user-name">Terry</h2>
            <p className="user-level">Level 3 — Debugger Pro</p>
          </div>
          <div className="xp-bar">
            <div className="xp-fill"></div>
          </div>
          <p className="xp-points">120 XP</p>
        </div>

        {/* Bug list */}
        <div className="bug-section">
          <div className="bug-header">
            <h2>Bug List</h2>
            <button className="login-button">Add Bug</button>
          </div>

          <table className="project-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Severity</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bugs.map((b) => (
                <tr key={b.id}>
                  <td>{b.title}</td>
                  <td>{b.severity}</td>
                  <td>{b.priority}</td>
                  <td>
                    <span
                      className={
                        b.status === "Resolved" ? "status resolved" : "status open"
                      }
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ProjectsPage;
