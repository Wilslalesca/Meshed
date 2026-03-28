import { useState } from "react";
import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { CourseBlock } from '@/features/add-edit-courses/components/CourseBlock';
import { EmptyState } from '@/features/athlete-schedule/components/EmptyState';
import { AddCourseModal } from "@/features/add-edit-courses/components/AddCourseModal";
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Upload } from '@/features/upload/components/Upload';

import { TeamScheduleCalendar } from "@/features/teams/components/schedule/TeamScheduleCalendar";
import { TeamScheduleMode, TeamScheduleView, type TeamScheduleEvent } from "@/features/teams/types/schedule";

import { useTeamSchedule } from "@/features/teams/hooks/useTeamSchedule";
import { useUserTeams } from "@/features/teams/hooks/useUserTeams";


export default function AthleteSchedulePage() {
    const { user, loading: authLoading } = useAuth();
    const athleteId = user?.id;
    const { schedule, loading, refetch } = useAthleteSchedule(athleteId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [viewMode, setViewMode] = useState<"cards" | "calendar">("cards");
    const [calendarView, setCalendarView] = useState<TeamScheduleView>("timeGridWeek");
    const [calendarMode, setCalendarMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);

    const { teams, loading: teamsLoading } = useUserTeams();

    const teamId = teams?.[0]?.id;
    const fromISO = new Date().toISOString();
    const toISO = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString();

    const { 
        events: teamEvents,
        loading: teamScheduleLoading
    } = useTeamSchedule(teamId, fromISO, toISO);

    // const filteredEvents = (teamEvents || []).filter((e) => {
    //     return (
    //         e.athleteId === athleteId ||   
    //         e.type === "Practice" ||       
    //         e.type === "Team Event"        
    //     );
    // });

    const [search, setSearch] = useState("");

    function getDateForDayOfWeek(day: string): Date {
        const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        const today = new Date();
        const todayIndex = today.getDay();
        const targetIndex = days.indexOf(day);
        const diff = targetIndex - todayIndex;

        const result = new Date(today);
        result.setDate(today.getDate() + diff);
        return result;
    }

    if (authLoading || loading || teamsLoading || teamScheduleLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='p-6'>
            <div className="flex items-center justify-between flex-wrap mb-4 gap-2">
                <h1 className='text-2xl font-semibold'>My Schedule</h1>
                <div className="flex flex-wrap items-center gap-2">
                    {/* View toggle buttons */}
                    <Button
                        variant={viewMode === "cards" ? "default" : "outline"}
                        onClick={() => setViewMode("cards")}
                    >
                        Cards
                    </Button>
                    <Button
                        variant={viewMode === "calendar" ? "default" : "outline"}
                        onClick={() => setViewMode("calendar")}
                    >
                        Calendar
                    </Button>

                    <Button onClick={() => setIsAddModalOpen(true)}>Add Event</Button>
                    <AddCourseModal
                        open={isAddModalOpen}
                        onOpenChange={setIsAddModalOpen}
                        onAdded={() => refetch()}
                    />
                    <Upload onAdded={() => refetch()} />
                </div>
            </div>

            {!schedule?.length ? (
                <EmptyState />
            ) : viewMode === "cards" ? (
                <CourseBlock data={schedule} onAdded={() => refetch()} />
            ) : (
                <TeamScheduleCalendar
                    view={calendarView}
                    setView={setCalendarView}
                    events={(schedule || []).map((item) => {
                        const baseDate = getDateForDayOfWeek(item.day_of_week);

                        const start = new Date(baseDate);
                        const [startHour, startMin] = item.start_time.split(":");
                        start.setHours(Number(startHour), Number(startMin), 0);

                        const end = new Date(baseDate);
                        const [endHour, endMin] = item.end_time.split(":");
                        end.setHours(Number(endHour), Number(endMin), 0);

                        const event: TeamScheduleEvent = {
                            id: item.id,
                            athleteId: athleteId ?? "unknown",
                            athleteName: "My Class",
                            title: `${item.course_code} - ${item.name}`,
                            name: item.name,
                            location: item.location ?? undefined,
                            startTime: start,
                            endTime: end,
                            type: "Class"
                        };
                        return event;
                    })}
                    mode={calendarMode}
                    setMode={setCalendarMode}
                    search={search}
                    setSearch={setSearch}
                    fromISO={new Date().toISOString()}
                    toISO={new Date().toISOString()}
                    onRangeChange={() => {}}
                />
            )}
        </div>
    );
}
