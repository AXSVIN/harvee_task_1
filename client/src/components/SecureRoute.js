import { Navigate } from "react-router-dom";

const SecureRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const savedRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />;

  if (role && savedRole !== role) return <Navigate to="/login" />;

  return children;
};

export default SecureRoute;
