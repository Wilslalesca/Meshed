import { useUserRole } from "@/shared/hooks/useUserRole";
import { UserDashboard }  from "./views/userView";
import { ManagerView } from "./views/managerView";


export const DashboardView = () => {
    const role = useUserRole();

    if (role.isUser) {
        return UserDashboard();
    }
    else if (role.isManager) {
        return ManagerView();
    }
}