import "./App.css";
import { useState } from "react";

function Bugs() {
  const [filter, setFilter] = useState("All");
  const [bugs] = useState([
    {
      id: 1,
      title: "Login button not working",
      severity: "High",
      priority: "Urgent",
      status: "Open",
      assigned: "Ioana",
    },
    {
      id: 2,
      title: "Navbar misaligned",
      severity: "Low",
      priority: "Low",
      status: "Fixed",
      assigned: "Daria",
    },
  ]);

  const filtered = bugs.filter(
    (b) => filter === "All" || b.status === filter
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">Bugs</h1>
        <p className="subtitle">Track and manage bugs in your projects</p>

        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All</option>
          <option>Open</option>
          <option>Fixed</option>
        </select>

        <table className="project-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Severity</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id}>
                <td>{b.title}</td>
                <td>{b.severity}</td>
                <td>{b.priority}</td>
                <td>{b.status}</td>
                <td>{b.assigned}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="login-button" style={{ marginTop: "25px" }}>
          + Report Bug
        </button>
      </div>
    </div>
  );
}

export default Bugs;