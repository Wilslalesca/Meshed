import { StatCard } from "../components/StatCard";
import { ManagerWidget } from "../components/ManagerWidget";
import { ActivityFeed } from "../components/ActivityFeed";

export const ManagerDashboard = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            {/* Overview Stats */}
            <div className="col-span-1 lg:col-span-2 xl:col-span-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <StatCard title="Active Athletes" value="42" />
                    <StatCard title="Total Sessions" value="18" />
                    <StatCard title="Facility Usage %" value="87%" />
                    <StatCard title="Pending Requests" value="5" />
                </div>
            </div>

            {/* Manager Insights */}
            <div className="col-span-2 xl:col-span-3">
                <ManagerWidget />
            </div>

            {/* Activity Feed */}
            <div className="col-span-2 xl:col-span-1">
                <ActivityFeed />
            </div>
        </div>
    );
};
