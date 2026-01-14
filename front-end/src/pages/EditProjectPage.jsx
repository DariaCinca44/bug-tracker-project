import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/EditProjectPage.css";

function EditProjectPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [loading, setLoading] = useState(true);

  // protectie auth
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  // incarcam datele proiectului (precompletare)
  useEffect(() => {
    api
      .get(`/projects/${projectId}`)
      .then((res) => {
        setName(res.data.name);
        setDescription(res.data.description || "");
        setRepoUrl(res.data.repoUrl);
        setLoading(false);
      })
      .catch(() => {
        alert("Nu pot incarca proiectul");
        navigate("/dashboard");
      });
  }, [projectId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.patch(`/projects/${projectId}`, {
        name,
        description,
        repoUrl,
      });

      navigate(`/project/${projectId}`);
    } catch (err) {
      alert(err.response?.data?.message || "Eroare la editare proiect");
    }
  };

  if (loading) {
    return <p style={{ color: "white", padding: "40px" }}>Loading...</p>;
  }

  return (
  <div className="edit-project-page">
    <h1 className="edit-project-title">Edit Project</h1>

    <form className="edit-project-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Repository URL</label>
        <input
          type="text"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          required
        />
      </div>

      <button type="submit" className="submit-project-btn">
        Save changes
      </button>
    </form>
  </div>
);

}

export default EditProjectPage;
