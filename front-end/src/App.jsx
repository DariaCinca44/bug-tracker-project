import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import BugDetailsPage from "./pages/BugDetailsPage";
import AddBugPage from "./pages/AddBugPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import ProjectPage from "./pages/ProjectPage";
import EditProjectPage from "./pages/EditProjectPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bug/:id" element={<BugDetailsPage />} />
        <Route path="/project/:id/add-bug" element={<AddBugPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="/project/:id/edit" element={<EditProjectPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;