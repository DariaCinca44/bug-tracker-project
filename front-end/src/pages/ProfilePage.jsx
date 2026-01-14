import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ProfilePage.css";

function ProfilePage() {
const [user, setUser] = useState(null);
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username"); // daca il mai folosesti undeva
  navigate("/");
};

  // protectie
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  // load user real
  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        alert("Eroare la incarcare profil");
      });
  }, []);

  if (!user) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }
 

  return (
    <div className="profile-page">
      <h1 className="profile-title">Profile Page</h1>

      {/* CARD PROFIL */}
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">👤</div>
        </div>

        <div className="profile-info">
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          <div className="profile-xp">
            <span>
              Nivel {user.level} • {user.title}{user.xp} XP
            </span>
          </div>


          <div className="xp-bar">
            <div
              className="xp-bar-fill"
              style={{ width: "60%" }}
            ></div>
          </div>
        </div>
      </div>
    <button
      onClick={handleLogout}
      className="logout-btn"
    >
      Logout
    </button>


      {/* PROIECTE */}
      <h2 className="projects-title">Projects</h2>
      <p className="projects-subtitle">Member of:</p>

      <div className="projects-list">
        {user.projects.length === 0 && (
          <p style={{ color: "gray" }}>No projects yet.</p>
        )}

        {user.projects.map((project) => (
          <div key={project.id} className="project-card">
            <span>{project.name}</span>

            <button
              className="details-button"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              Vezi detalii
            </button>
          </div>
        ))}
      </div>
      </div>
  );
}

 
export default ProfilePage;
