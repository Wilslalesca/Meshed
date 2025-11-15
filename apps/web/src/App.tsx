import React from "react";
import { Routes, Route, Outlet, Navigate, useLocation } from "react-router-dom";
import { Home } from "./screens/Home";
import LoginPage from "./routes/auth/Login.tsx";
import { Register } from "./routes/auth/Register.tsx";
import { Dashboard } from "./routes/dashboard";
import { Admin } from "./screens/Admin";
import { Profile } from "./screens/Profile";
import { Teams } from "./screens/Teams";
import { Upload } from "./features/upload/components/Upload.tsx";
import { useAuth } from "./shared/hooks/useAuth";
import ScheduleBackground from './screens/ScheduleBackground';
import { Layout } from "./shared/components/layout/Layout.tsx";
import { AddCourse } from "./routes/courses/AddCourse.tsx";
import { EditCourse } from "./routes/courses/EditCourse.tsx";
import AthleteSchedulePage from "./routes/athlete/schedule";
import { Toaster } from "@/shared/components/ui/sonner";
import { ProtectedRoute } from "./shared/components/ProtectedRoute.tsx";



const pageTitles: Record<string, string> = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/admin": "Admin Panel",
  "/teams": "Teams",
  "/facilities": "Facilities",
  "/manager": "Schedule Background Tasks",
  "/mySchedule": "My Schedule",
  "/profile": "Profile",
};

function AppLayout() {
    return (
        <Layout>
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
      <Route element={<AuthLayout />}>
        <Route path="/login" element={ <GuestRoute> <LoginPage /> </GuestRoute> } />
        <Route path="/register" element={ <GuestRoute> <Register /> </GuestRoute> } />
      </Route>

      <Route element={<AppLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
        <Route path="/teams" element={ <ProtectedRoute> <Teams /> </ProtectedRoute> }/>
        <Route path="/admin" element={ <ProtectedRoute allowedRoles={["admin"]}><Admin /> </ProtectedRoute> }/>
        <Route path="/manager" element={ <ProtectedRoute allowedRoles={["admin", "manager"]}> <ScheduleBackground /> </ProtectedRoute> }/>
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
