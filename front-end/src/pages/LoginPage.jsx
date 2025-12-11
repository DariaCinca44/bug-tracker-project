import "../styles/Login.css";

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">🐞 Bug Tracker</h1>
        <p className="subtitle">Please log in to your account</p>

        <form>
          <label>Email:</label>
          <input type="email" placeholder="Enter your email" />

          <label>Password:</label>
          <input type="password" placeholder="Enter your password" />

          <button type="submit">Log In</button>
        </form>

        <p className="signup-text">
          Don’t have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;