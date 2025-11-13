import { useUserRole } from "@/shared/hooks/useUserRole";
import  { UserDashboard }  from "./views/userView";
// import { facilityView } from "./views/facilityView";
// import { managerView } from "./views/managerView";

export const test = () => {
    return UserDashboard();

    // switch (role) {
    //     case "student":
    //     case "athlete":
    //         return <userView />;
    //     case "coach":
    //     case "manager":
    //         return <managerView />;
    //     case "facility_manager":
    //         return <facilityView />;
    //     case "admin":
    //         return <adminView />;
    //     default:
    //         return (
    //             <div className="flex items-center justify-center h-full text-grey-600">
    //                 Something went wrong. Please contact support.
    //             </div>
    //         );
    // }
    // }
    
}