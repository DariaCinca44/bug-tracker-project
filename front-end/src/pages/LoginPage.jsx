import "../styles/Login.css";
import { useState } from "react";
import api from "../api/axios";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch  {
      setError("Email sau parola invalida");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">🐞 Bug Tracker</h1>
        <p className="subtitle">Please log in to your account</p>

        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" 
          value={email} onChange={(e) => setEmail(e.target.value)}/>

          <label>Password:</label>
          <input type="password" placeholder="Enter your password" value={password}
            onChange={(e) => setPassword(e.target.value)}/>

          <button type="submit">Log In</button>
          {error && <p className="error">{error}</p>}
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;