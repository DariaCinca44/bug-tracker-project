import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);
  
  useEffect(() => {
  api.get("/projects")
    .then((res) => {
      console.log("RES.DATA =", res.data);
      setProjects(res.data);
    })
    .catch(() => {
      console.log("Eroare la incarcare proiecte");
    });
}, []);

useEffect(() => {
  api.get("/users/me")
    .then(res => setUserId(res.data.id))
    .catch(() => {});
}, []);
useEffect(() => {
  api.get("/users/me")
    .then(res => setUser(res.data))
    .catch(() => {});
}, []);


   const handleAddProject = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const description=e.target.description.value;
    const repositoryUrl = e.target.repo.value;

    try {
      const res = await api.post("/projects", {
        name,
        description,
        repoUrl: repositoryUrl
      });

      setProjects([...projects, res.data.project]);
      e.target.reset();
    } catch {
      alert("Eroare la creare proiect");
    }
  };
  const handleDeleteProject = async (e, projectId) => {
  e.stopPropagation();

  const ok = window.confirm("Sigur vrei sa stergi proiectul?");
  if (!ok) return;

  try {
    await api.delete(`/projects/${projectId}`);
    setProjects(projects.filter(p => p.id !== projectId));
  } catch (err) {
    alert(err.response?.data?.message || "Nu poti sterge acest proiect");
  }
};

  return (
    <div className="dashboard-container">

      {/* SIDEBAR */}
      <aside className="sidebar">
  <h3 className="sidebar-title">PROJECTS</h3>

  {/* LISTA PROoj*/}
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

  {/* addProject */}
  <div className="sidebar-bottom">
    <form
      className="sidebar-add-form"
      onSubmit={handleAddProject}>
      <input name="name" placeholder="Project Name" required />
      <input name="description" placeholder="Descriere" />
      <input name="repo" placeholder="Repository URL GitHub" required />
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
              <span className="project-repo">{project.repoUrl}</span>
          
            {project.createdById === userId && (
              <button
                className="delete-project-btn"
                onClick={(e) => handleDeleteProject(e, project.id)}
              >
                Delete
              </button>
            )}
            </div>
          ))}
          </div>
        
      </main>

      {/* RIGHT PANEL */}
      <aside className="right-panel">

        {/* USER XP BOX */}
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
