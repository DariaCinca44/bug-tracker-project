import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";


function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const XP_PER_LEVEL = 100;

  const currentLevelXP = user ? user.xp % XP_PER_LEVEL : 0;
  const progressPercent = (currentLevelXP / XP_PER_LEVEL) * 100;

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
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <span className="xp-text">
              {currentLevelXP} / {XP_PER_LEVEL} XP
            </span>
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

      <div className="dashboard-projects-grid">
        {projects.map((project) => (
          <div
            key={project.id}
            className="db-card"
            onClick={() => navigate(`/project/${project.id}`)}
          >
            <div className="db-card-content">
              <div className="db-card-header">
                <h3 className="db-card-title">{project.name}</h3>
                <div className="db-card-stats">
                </div>
              </div>
              
              <p className="db-card-desc">{project.description}</p>
            </div>
            {project.createdById === userId && (
                <button
                  className="db-delete-btn"
                  onClick={(e) => handleDeleteProject(e, project.id)}
                >
                  Delete
                </button>
              )}
            <div className="db-card-footer">
              <a 
                href={project.repoUrl.startsWith("http") ? project.repoUrl : `https://${project.repoUrl}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="db-repo-link-box"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="db-repo-info">
                  <svg className="db-github-icon" viewBox="0 0 24 24" width="18" height="18">
                    <path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  <span className="db-repo-text">{project.repoUrl}</span>
                </div>
                <span className="db-arrow">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      </main>

    </div>
  );
}

export default Dashboard;
