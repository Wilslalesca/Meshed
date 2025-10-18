import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RequireRole } from "./routes/RequireRole";


import { Home } from "./screens/Home";
import LoginPage from "./screens/Login";
import { Register } from "./screens/Register";
import { Dashboard } from "./screens/Dashboard";
import { Teams } from "./screens/Teams"
import { Admin } from "./screens/Admin";
import { Profile } from "./screens/Profile";
import { Upload } from "./screens/Upload";
import { useAuth } from "./hooks/useAuth";
import ScheduleBackground from './screens/ScheduleBackground';
import { Layout } from "./components/layout/Layout";

function AppLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AuthLayout() {
  return <Outlet />;
}

function GuestRoute({ children }: { children: React.ReactNode }) {
  const { token, isLoading } = useAuth();
  if (isLoading) return <div>Loading...</div>;
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      {/* Auth (no sidebar) */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
      </Route>


      {/* Main (with sidebar layout) */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <RequireRole allow="admin">
                <Admin />
              </RequireRole>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <ProtectedRoute>
              <RequireRole allow={["manager", "admin"]}>
                <ScheduleBackground />
              </RequireRole>
            </ProtectedRoute>
          }
        />
        <Route
          path="/teams"
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
            }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
