import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SecureRoute from "./components/SecureRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/user-dashboard"
          element={
            <SecureRoute role="user">
              <UserDashboard />
            </SecureRoute>
          }
        />

        <Route
          path="/admin-dashboard"
          element={
            <SecureRoute role="admin">
              <AdminDashboard />
            </SecureRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
