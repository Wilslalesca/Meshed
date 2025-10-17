import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 mx-6 my-4">
      <div className="p-4 rounded-lg border border-[#E5E7EB] bg-gray-50">
        <p className="text-gray-700">
          Hello, <strong>{user?.firstName}</strong>{" "}
          <Badge variant="secondary">{user?.role}</Badge>
        </p>
      </div>

      <div className="flex gap-3">
        <Button asChild variant="outline">
          <Link to="/profile">Profile</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/upload">Upload</Link>
        </Button>
        <Button variant="destructive" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};
