import { useUserRole } from "@/shared/hooks/useUserRole";
import { UserDashboard }  from "./views/userView";
import { ManagerView } from "./views/managerView";
import { AdminDashboard } from "./views/adminView";


export const DashboardView = () => {
    const role = useUserRole();

    if (role.isUser) {
        return UserDashboard();
    }
    else if (role.isManager) {
        return ManagerView();
    }
    else if (role.isAdmin){
        return AdminDashboard();
    }
}