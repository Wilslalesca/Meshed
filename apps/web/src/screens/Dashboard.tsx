import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();

    return (
        <div className="max-w-4xl mx-auto p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Hello,{" "}
                    <strong className="text-foreground">{user?.name}</strong>{" "}
                    <Badge variant="secondary" className="ml-2">
                        {user?.role}
                    </Badge>
                </p>
            </div>

            <div className="flex flex-wrap gap-4">
                {user?.role === "admin" && (
                    <Button asChild>
                        <Link to="/admin">Admin Panel</Link>
                    </Button>
                )}

                {(user?.role === "admin" || user?.role === "manager") && (
                    <Button asChild>
                        <Link to="/manager">Manager Panel</Link>
                    </Button>
                )}

                {(user?.role === "user") && (
                    <Button asChild variant="outline">
                        <Link to="/upload">Upload</Link>
                    </Button>
                )}

                <Button asChild variant="outline">
                    <Link to="/profile">Profile</Link>
                </Button>

                <Button variant="destructive" onClick={logout}>
                    Logout
                </Button>
            </div>
        </div>
    );
};
