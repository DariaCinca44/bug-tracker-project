import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/Dashboard.css";

function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null); 
  const [bugs,setBugs] = useState([]);
  const [members, setMembers] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    api.get("/users/me")
      .then(res => setUserId(res.data.id))
      .catch(() => {});
  }, []);


   useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  const joinAsTester = async () => {
  try {
    await api.post(`/projects/${id}/join`);
    setRole("TST");
    alert("You are now a tester in this project!");
  } catch  {
    alert( "Cannot join project");
  }
};
  const promoteToMP = async (userId) => {
  try {
    await api.patch(`/projects/${id}/members/${userId}/promote`);
    alert("User promoted to MP");

    // refresh lista
    const res = await api.get(`/projects/${id}`);
    setMembers(res.data.members);
  } catch{
    alert("Cannot promote user");
  }
};

  // const joinAsMP = async () => {
  //   try {
  //     await api.post(`/projects/${id}/join`, { role: "MP" });
  //     setRole("MP");
  //     alert("You are now a mp in this project!");
  //   } catch {
  //     alert("Cannot join as MP");
  //   }
  // };

//aflam rol user
useEffect(() => {
  if (!userId) return;
  api.get(`/projects/${id}`)
    .then(res => {
      const member = res.data.members.find(m => m.user.id === userId);
      if (member) {
        setRole(member.role); // "MP" sau "TST"
      } else {
        setRole(null);
      }
    })
    .catch(() => {});
}, [id, userId]);

useEffect(() => {
  if (role !== "MP" && role !== "TST") {
    setBugs([]);
    return;
  }

  api.get(`/projects/${id}/bugs`)
    .then(res => setBugs(res.data))
    .catch(() => {});
}, [id, role]);

useEffect(() => {
  if (role !== "MP") return;

  api.get(`/projects/${id}`)
    .then(res => {
      setMembers(res.data.members);
    })
    .catch(() => {});
}, [id, role]);



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

        <div style={{ marginTop: "auto" }} />

        {role === null && (
            <button onClick={joinAsTester} className="sidebar-add-btn">
              Join as Tester
            </button>
          )}

          {/* {role === null && (
            <button onClick={joinAsMP} className="sidebar-add-btn">
              Join as MP
            </button>
          )} */}

          {/* DACA ESTI MP
          {role === "MP" && (
            <button onClick={joinAsTester} className="sidebar-add-btn">
              Join as Tester
            </button>
          )} */}

            {role === "TST" && (
                <button
                  className="sidebar-add-btn"
                  onClick={() => navigate(`/project/${id}/add-bug`)}
                >
                  + Add Bug
                </button>
          )}
          


        {/* <button
          className="sidebar-add-btn"
          onClick={() => (window.location.href = `/project/${id}/add-bug`)}
        >
          + Add Bug
        </button> */}
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <h1 className="main-title">Project  Bugs</h1>
        {role===null && (
          <p style={{ color: "gray", marginTop: "20px" }}>
            You must join this project as Tester to see bugs.
          </p>
        )}
        {(role === "MP" || role === "TST")&& (
        <div className="projects-grid">
          {bugs.map((bug) => (
            <div
              key={bug.id}
              className="project-card"
              onClick={() => navigate(`/bug/${bug.id}`)}
              style={{ cursor: "pointer" }}>
              <h3>{bug.title}</h3>
              <p>
                Severity: <strong>{bug.severity}</strong> | Priority:{" "}
                <strong>{bug.priority}</strong>
              </p>
              <p>Status: {bug.status}</p>
              <span className="project-repo">
                Assigned to: {bug.assignedId || "Unassigned"}
              </span>
            </div>
          ))}
        </div>
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">
        <div className="user-box">
          <h3 className="user-name">
           User
          </h3>
          <p className="user-level">Level 3 — Bug Fixer</p>

          <div className="xp-bar">
            <div className="xp-fill" style={{ width: "40%" }}></div>
          </div>

          <span className="xp-text">60 XP / 200 XP</span>
        </div>
        {role === "MP" && (
          <div className="user-box">
            <h3 className="notif-title">Project Members</h3>

            {members.map(m => (
              <div
                key={m.userId}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                  background: "#1c2038",
                  padding: "8px",
                  borderRadius: "8px"
                }}
              >
                <span style={{ fontSize: "14px" }}>
                  {m.user.name} — <strong>{m.role}</strong>
                </span>

                {m.role === "TST" && (
                  <button
                    onClick={() => promoteToMP(m.userId)}
                    style={{
                      background: "#6c63ff",
                      border: "none",
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "12px"
                    }}
                  >
                    Promote
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

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
