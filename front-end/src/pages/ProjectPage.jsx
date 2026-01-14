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
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [notifications, setNotifications] = useState([]);


  const openEditForm = () => {
  navigate(`/project/${id}/edit`);
};

  useEffect(() => {
    api.get("/users/me")
      .then(res => {
      setUserId(res.data.id);
      setUser(res.data);
    })
      .catch(() => {});
  }, []);


   useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  useEffect(() => {
  api.get("/notifications")
    .then(res => setNotifications(res.data))
    .catch(() => {});
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
useEffect(() => {
  if (!userId) return;
  api.get(`/projects/${id}`)
    .then(res => {
      setProject(res.data);
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
       <h1 className="sidebar-title">
        {project ? project.name : "PROJECT"}
      </h1>


        <button
          className="sidebar-project-btn"
          onClick={() => (window.location.href = "/dashboard")}
        >
          ⬅ Back to Dashboard
        </button>
        {role === "MP" && (
        <button
          className="edit-project-btn"
          onClick={openEditForm}
        >
          Edit Project
        </button>
   )}
        <div style={{ marginTop: "auto" }} />
        
        {role === null && (
            <button onClick={joinAsTester} className="sidebar-add-btn">
              Join as Tester
            </button>
          )}

            {role === "TST" && (
                <button
                  className="sidebar-add-btn"
                  onClick={() => navigate(`/project/${id}/add-bug`)}
                >
                  + Add Bug
                </button>
          )}
          
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
                {bug.status === "RESOLVED"
                  ? "Done"
                  : bug.assignedId
                    ? "Assigned"
                    : "Unassigned"}
              </span>
            </div>
          ))}
        </div>
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">
        <div
      className="user-box"
      onClick={() => navigate("/profile")}
      style={{ cursor: "pointer" }}
    >
      <h3 className="user-name">
        {user ? user.name : "User"}
      </h3>

      <p className="user-level">
        Level {user?.level}
      </p>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{
            width: user
              ? `${Math.min((user.xp / 200) * 100, 100)}%`
              : "0%",
          }}
        />
      </div>

        <span className="xp-text">
          {user ? `${user.xp} XP` : "0 XP"}
        </span>
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
    <h3 className="notif-title">Your history</h3>
    

    {notifications.length === 0 && (
      <p style={{ color: "#94a3b8", fontSize: "14px" }}>
        Let's start!
      </p>
    )}

    {notifications.map(n => (
      <div
        key={n.id}
        className={`notif-item ${n.readAt ? "read" : "unread"}`}
        onClick={() => {
          api.patch(`/notifications/${n.id}/read`);
          setNotifications(prev =>
              prev.filter(x => x.id !== n.id)
          );
        }}
        >
          {n.message}
      </div>
    ))}
</div>

      </aside>
    </div>
  );
}
export default ProjectPage;
