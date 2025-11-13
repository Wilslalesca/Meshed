import { StatCard } from "../components/StatCard";
import { FacilityWidget } from "../components/FacilityWidget";
import { ActivityFeed } from "../components/ActivityFeed";

export const FacilityDashboard = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4 p-4">
            {/* Stats */}
            <div className="col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <StatCard title="Open Facilities" value="6" />
                <StatCard title="Booked Hours" value="32" />
                <StatCard title="Maintenance Tasks" value="2" />
                <StatCard title="Reports Submitted" value="7" />
            </div>

            {/* Facility Status */}
            <div className="col-span-2 xl:col-span-3">
                <FacilityWidget />
            </div>

            {/* Activity Feed */}
            <div className="col-span-2 xl:col-span-1">
                <ActivityFeed />
            </div>
        </div>
    );
};
