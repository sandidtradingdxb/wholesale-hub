import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="max-w-7xl mx-auto px-6 py-16 font-mono text-sm">Loading…</div>;
  if (!user || user.role !== "admin") return <Navigate to="/login" replace />;

  return children;
}
