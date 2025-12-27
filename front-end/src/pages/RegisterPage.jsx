import "../styles/Login.css";
import { useState } from "react";
import api from "../api/axios";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const [error, setError] = useState("");

     const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      alert("Cont creat cu succes!");
      window.location.href = "/";
    } catch {
      setError("Eroare la creare cont. Email deja folosit.");
    }
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">🐞 Bug Tracker</h1>
        <p className="subtitle">Create your account</p>

        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">Create Account</button>
          {error && <p className="error">{error}</p>}
        </form>

        <p className="signup-text">
          Already have an account? <a href="/">Log in</a>
        </p>
      </div>
    </div>
  );
}
