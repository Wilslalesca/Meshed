import React from "react";
import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { RequireRole } from "./routes/RequireRole";


import { Home } from "./screens/Home";
import LoginPage from "./screens/Login";
import { Register } from "./screens/Register";
import { Dashboard } from "./screens/Dashboard";
import { Admin } from "./screens/Admin";
import { Profile } from "./screens/Profile";
import { useAuth } from "./hooks/useAuth";
import ScheduleBackground from './screens/ScheduleBackground';

function AppLayout() {
    return (
        <div className="min-h-screen">
            <main className="w-full">
                <Outlet />
            </main>
        </div>
    );
}

function AuthLayout() {
    return (
        <div>
            <Outlet />
        </div>
    );
}

function GuestRoute({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (token) {
        return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
}

export default function App() {
    return (
        <div>
            <Routes>
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

                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
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
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
}
