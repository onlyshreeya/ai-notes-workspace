import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage  from "./pages/LandingPage";
import LoginPage    from "./pages/LoginPage";
import SignupPage   from "./pages/SignupPage";
import Dashboard    from "./pages/Dashboard";
import SharedNote   from "./pages/SharedNote";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={token ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
        <Route path="/login"             element={token ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/signup"            element={token ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
        <Route path="/dashboard"         element={token ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/shared/:shareId"   element={<SharedNote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
