import { useState, useEffect } from "react";
import {useParams} from "react-router-dom";
import api from "../api/axios";
import "../styles/AddBugPage.css";

function AddBugPage() {
  const [title, setTitle] = useState("");
  const [commitUrl, setCommitUrl] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("LOW");
  const [priority, setPriority] = useState("LOW");
  const { id: projectId } = useParams();

useEffect(() => {
    if (!localStorage.getItem("token")) {
      window.location.href = "/";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(`/bugs/projects/${projectId}/bugs`, {
        title,
        commitUrl,
        description,
        severity,
        priority,
      }); 

     window.location.href = `/project/${projectId}`;
    } catch (err) {
  console.log(err);
  alert(err.response?.data?.message || "Eroare la creare bug");
}
  };

  return (
    <div className="add-bug-page">
      <h1 className="add-bug-title">Add Bug🐞</h1>

      <form className="add-bug-form" onSubmit={handleSubmit}>
        {/* TITLE */}
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Commit Url</label>
          <input
            type="text"
            value={commitUrl}
            onChange={(e) => setCommitUrl(e.target.value)}
            required
          />
        </div>
        {/* DESCRIPTION */}
        <div className="form-group">
          <label>Description</label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* SEVERITY */}
        <div className="form-group">
          <label>Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* PRIORITY */}
        <div className="form-group">
          <label>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>
        
          <button type="submit" className="submit-bug-btn">
          Add Bug
        </button>
      </form>
    </div>
  );
}

export default AddBugPage;
