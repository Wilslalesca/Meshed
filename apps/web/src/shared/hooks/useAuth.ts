import { useNavigate } from "react-router-dom";
import { useAuthCtx } from "@/shared/context/AuthContext";

export function useAuth() {
  const ctx = useAuthCtx();
  const navigate = useNavigate();

  const logoutAndRedirect = () => {
    ctx.logout();
    navigate("/login", { replace: true });
  };

  return {
    ...ctx,
    logout: logoutAndRedirect,
  };
}
