import React, { use } from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RequireRole } from "./routes/RequireRole";

import { Home } from "./screens/Home";
import LoginPage from "./screens/Login";
import { Register } from "./screens/Register";
import { Dashboard } from "./screens/Dashboard";
import { Teams } from "./screens/Teams";
import { Facilities } from "./screens/Facilities";
import { Admin } from "./screens/Admin";
import { Profile } from "./screens/Profile";
import { Upload } from "./routes/upload/Upload";
import { useAuth } from "./hooks/useAuth";
import ScheduleBackground from "./screens/ScheduleBackground";
import { Layout } from "./components/layout/Layout";
import { AddCourse } from "./routes/courses/AddCourse.tsx";
import { EditCourse } from "./routes/courses/EditCourse.tsx";
import AthleteSchedulePage from "./routes/athlete/schedule";
import { Toaster } from "@/components/ui/sonner"

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/admin": "Admin Panel",
  "/teams": "Teams",
  "/facilities": "Facilities",
  "/manager": "Schedule Background Tasks",
  "/upload": "Upload",
  "/mySchedule": "My Schedule",
  "/profile": "Profile",
};

function AppLayout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "UMA App";
  return (
    <Layout title={title}>
      <Outlet />
      <Toaster />
    </Layout>
  );
}

function AuthLayout() {
  return (
      <Outlet />
  );
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
      {/* Public / Auth (no sidebar) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={ <GuestRoute> <LoginPage /> </GuestRoute> } />
        <Route path="/register" element={ <GuestRoute> <Register /> </GuestRoute> } />
      </Route>

      {/* Main (with sidebar layout) */}
      <Route element={<AppLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
        <Route path="/teams" element={ <ProtectedRoute> <Teams /> </ProtectedRoute> }/>
        <Route path="/facilities" element={ <ProtectedRoute> <Facilities /> </ProtectedRoute> }/>
        <Route path="/admin" element={ <ProtectedRoute> <RequireRole allow="admin"> <Admin /> </RequireRole> </ProtectedRoute> }/>
        <Route path="/manager" element={ <ProtectedRoute> <RequireRole allow={["manager", "admin"]}> <ScheduleBackground /> </RequireRole> </ProtectedRoute> }/>
        <Route path="/upload" element={ <ProtectedRoute> <Upload /> </ProtectedRoute> }/>
        <Route path="/mySchedule" element={ <ProtectedRoute> <AthleteSchedulePage /> </ProtectedRoute> }/>
        <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
        <Route path="/editcourse/:courseId" element={<ProtectedRoute><EditCourse /></ProtectedRoute>}/>
        <Route path="/addcourse" element={ <ProtectedRoute><AddCourse /></ProtectedRoute>}/>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
