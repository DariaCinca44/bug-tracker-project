import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/BugDetailsPage.css";

function BugDetailsPage() {
  const { id: bugId } = useParams();

  const navigate = useNavigate();

  const [bug, setBug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [commitUrl, setCommitUrl] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");


    useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]); 

  
    useEffect(() => {
      api.get("/users/me").then(res => setMe(res.data));
    }, []);

   useEffect(() => {
    api
      .get(`/bugs/bug/${bugId}`)
      .then((res) => {
        setBug(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        alert("Bug not found or access denied");
        navigate("/dashboard");
      });
  }, [bugId, navigate]);
  useEffect(() => {
    api
      .get(`/bugs/${bugId}/comments`)
      .then(res => setComments(res.data))
      .catch(() => {});
  }, [bugId]);

    const resolveBug = async () => {
    try {
      const res = await api.patch(`/bugs/${bugId}/status`, {
        status: "RESOLVED",
        commitUrl
      });

      setBug(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Cannot resolve bug");
    }
  };

    const assignToMe = async () => {
    try {
      const res = await api.patch(`/bugs/${bugId}/assign`);
      setBug(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Cannot assign bug");
    }
  };
 const addComment = async () => {
  if (!newComment.trim()) return;

  try {
    await api.post(`/bugs/${bugId}/comments`, {
      content: newComment
    });

    const res = await api.get(`/bugs/${bugId}/comments`);
    setComments(res.data);

    setNewComment("");
  } catch {
    alert("Cannot add comment");
  }
};



  if (loading) return <p>Loading...</p>;
  if (!bug) return <p className="bug-not-found">Bug not found</p>;
  

  return (
  <div className="bug-details-page">
    <div className="bug-card">
      <h1 className="bug-title">{bug.title}</h1>
      
      <p className="bug-description">
        {bug.description || "No description"}
      </p>

      <div className="bug-info">
        <span
          className={`badge severity ${bug.severity.toLowerCase()}`}
        >
          Severity: {bug.severity}
        </span>

        <span
          className={`badge priority ${bug.priority.toLowerCase()}`}>
          Priority: {bug.priority}
        </span>

        <span
          className={`badge status ${bug.status.toLowerCase()}`}>
          Status: {bug.status}
        </span>
      </div>

      <div className="comments-section" id="comments">
        <h2 className="comments-title">Comments</h2>

        {/* LISTA COMENTARII */}
        <div className="comments-list">
          {comments.length === 0 && (
            <p className="no-comments">No comments yet</p>
          )}

          {comments.map(c => (
            <div key={c.id} className="comment-card">
              <div className="comment-author">
                {c.author.name}
              </div>

              <div className="comment-content">
                {c.content}
              </div>

              <div className="comment-date">
                {new Date(c.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* ADD COMMENT */}
        <div className="add-comment">
          <textarea
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />

          <button className="comment-btn" onClick={addComment}>
            Add Comment
          </button>
        </div>
      </div>

      <div className="bug-actions">
        <button
          className="back-btn"
           onClick={() => navigate(`/project/${bug.projectId}`)}
        >
          ← Back to Project
        </button>

      <div className="action-right">
        {bug.status === "OPEN" && !bug.assignedId && (
        <button className="assign-btn" onClick={assignToMe}>
          Assign to me
        </button>
      )}

     {bug.status === "IN_PROGRESS" && bug.assignedId === me?.id && (
  <>
      <input
        type="text"
        placeholder="Commit URL"
        value={commitUrl}
        onChange={(e) => setCommitUrl(e.target.value)}
        className="commit-input"
      />

      <button className="resolve-btn" onClick={resolveBug}>
        Resolve Bug
      </button>
    </>
  )}
       </div>
      </div>
    </div>
  </div>
);

}

export default BugDetailsPage;
