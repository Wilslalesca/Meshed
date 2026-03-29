import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Home } from "./screens/Home";
import LoginPage from "./features/auth/pages/Login.tsx";
import ForgotPasswordPage from "./features/auth/pages/ForgotPassword.tsx";
import Register from "./features/auth/pages/Register.tsx";
import { Dashboard } from "./routes/dashboard";
import { Profile } from "./screens/Profile";
import { Facilities } from "./screens/Facilities.tsx";
import { OptimizePage } from "./screens/OptimizePage.tsx";
import { useAuth } from "./shared/hooks/useAuth";
import ScheduleBackground from './screens/ScheduleBackground';
import { Layout } from "./shared/components/layout/Layout.tsx";
import AthleteSchedulePage from "./routes/athlete/schedule";
import { Toaster } from "@/shared/components/ui/sonner";
import { ProtectedRoute } from "./shared/components/ProtectedRoute.tsx";
import { TeamDetailsPage } from "./features/teams/pages/TeamDetailsPage.tsx";
import { TeamsPage } from "@/features/teams/pages/TeamPage.tsx";
import { AthleteDetailsPage } from "@/features/teams/pages/AthleteDetailsPage.tsx";
import InviteRegisterPage from "./features/auth/pages/InviteRegisterPage.tsx";
import OrganizationPage from "@/features/organizations/page.tsx";

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
        <Route path="/forgot-password" element={ <GuestRoute> <ForgotPasswordPage /> </GuestRoute> } />
        <Route path="/register/invite" element={<GuestRoute>< InviteRegisterPage /></GuestRoute>} />
        <Route path="/register" element={ <GuestRoute> <Register /> </GuestRoute> } />
        

      </Route>

      <Route element={<AppLayout />}>

        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/dashboard" element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> }/>
        <Route path="/teams" element={ <ProtectedRoute> <TeamsPage /> </ProtectedRoute> }/>
        <Route path="/teams/:teamId" element={<ProtectedRoute><TeamDetailsPage /></ProtectedRoute>} />
        <Route path="/athletes/:athleteId" element={<ProtectedRoute><AthleteDetailsPage /></ProtectedRoute>} />
        <Route path="/manager" element={ <ProtectedRoute allowedRoles={["admin", "manager"]}> <ScheduleBackground /> </ProtectedRoute> }/>
        <Route path="/facilities" element={ <ProtectedRoute allowedRoles={["admin"]}> <Facilities /> </ProtectedRoute> }/>
        <Route path="/mySchedule" element={ <ProtectedRoute> <AthleteSchedulePage /> </ProtectedRoute> }/>
        <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute> }/>
        <Route path="/optimize" element={ <ProtectedRoute><OptimizePage /></ProtectedRoute>}/>
        <Route path="/organization" element={ <ProtectedRoute allowedRoles={["admin"]}><OrganizationPage /></ProtectedRoute>}/>
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
        </Routes>
    );
}
