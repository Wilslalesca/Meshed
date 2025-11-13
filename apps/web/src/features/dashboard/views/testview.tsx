import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { QuickActions } from "../components/QuickActions";
import { StatCardGradient } from "../components/StatCardGradient";
import { TimelineWidget } from "../components/TimelineWidget";
import { MiniCalendar } from "../components/MiniCalendar";
import { ActivityFeedEnhanced } from "../components/ActivityFeedEnhanced";
import { FacilityWidget } from "../components/FacilityWidget";
import { PerformanceGauge } from "../components/PerformanceGauge";

export const UserDashboard = () => {
  // 🔹 Temporary mock data (replace with backend later)
  const stats = [
    { title: "Upcoming Classes", value: "6", subtitle: "+2 this week", color: "from-blue-400/20 to-blue-600/30", icon: "📚" },
    { title: "Training Sessions", value: "3", subtitle: "+1 added", color: "from-purple-400/20 to-purple-600/30", icon: "💪" },
    { title: "Available Facilities", value: "5", subtitle: "Open today", color: "from-emerald-400/20 to-emerald-600/30", icon: "🏟️" },
    { title: "Unread Messages", value: "4", subtitle: "Coach updates", color: "from-amber-400/20 to-amber-600/30", icon: "💬" },
  ]

  const schedule = [
    { time: "08:00", label: "Strength Training", location: "Gym A" },
    { time: "10:30", label: "Math Lecture", location: "Tilley Hall 203" },
    { time: "14:00", label: "Team Practice", location: "Field 1" },
  ]

  const activity = [
    { user: "Coach Miller", text: "Uploaded new weekly schedule", time: "Today" },
    { user: "System", text: "Facility ‘Pool’ closed for maintenance", time: "Yesterday" },
    { user: "Teammate", text: "Commented on session: ‘Nice work!’", time: "2 days ago" },
  ]

  const facilities = [
    { name: "Gym A", status: "Available" },
    { name: "Field 1", status: "Booked" },
    { name: "Pool", status: "Maintenance" },
  ]

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* === Top Row: Stats === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCardGradient key={i} {...stat} />
        ))}
      </div>

      {/* === Quick Actions === */}
      <QuickActions />

      {/* === Middle: Schedule Timeline + Calendar + Activity === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Schedule + Timeline */}
        <Card className="col-span-2 backdrop-blur-sm border-border/40 bg-background/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Today’s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <TimelineWidget data={schedule} />
          </CardContent>
        </Card>

        {/* Right side: Calendar */}
        <Card className="backdrop-blur-sm border-border/40 bg-background/60">
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <MiniCalendar />
          </CardContent>
        </Card>
      </div>

      {/* === Bottom Section: Activity + Facilities + Performance === */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-1 backdrop-blur-sm border-border/40 bg-background/60">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ActivityFeedEnhanced data={activity} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 backdrop-blur-sm border-border/40 bg-background/60">
          <CardHeader>
            <CardTitle>Facility Availability</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <FacilityWidget data={facilities} />
          </CardContent>
        </Card>

        <Card className="xl:col-span-1 backdrop-blur-sm border-border/40 bg-background/60">
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64">
            <PerformanceGauge progress={82} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
