import { useState } from "react";
import { useAthleteSchedule } from '@/features/athlete-schedule/hooks/useAthleteSchedule';
import { CourseBlock } from '@/features/add-edit-courses/components/CourseBlock';
import { EmptyState } from '@/features/athlete-schedule/components/EmptyState';
import { AddCourseModal } from "@/features/add-edit-courses/components/AddCourseModal";
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@/shared/components/ui/button';
import { Upload } from '@/features/upload/components/Upload';
import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { TeamScheduleCalendar } from "@/features/teams/components/schedule/TeamScheduleCalendar";
import { TeamScheduleMode, TeamScheduleView, type TeamScheduleEvent } from "@/features/teams/types/schedule";

export default function AthleteSchedulePage() {
    const { user  } = useAuth();
    const athleteId = user?.id;
    const { schedule, refetch } = useAthleteSchedule(athleteId);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

    const [viewMode, setViewMode] = useState<"cards" | "calendar">("cards");
    const [calendarView, setCalendarView] = useState<TeamScheduleView>("timeGridWeek");
    const [calendarMode, setCalendarMode] = useState<TeamScheduleMode>(TeamScheduleMode.Calendar);

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

    return (
        <div className='p-6'>
            <div className="flex items-center justify-between flex-wrap mb-4 gap-2">
                <h1 className='text-2xl font-semibold'>My Schedule</h1>
                <div className="flex flex-wrap items-center gap-2">
                     <div className="gap-3">
                        <Tabs
                            value={viewMode}
                            onValueChange={(value) => setViewMode(value as "cards" | "calendar")}
                            className="w-full"
                        >
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger className="w-full" value="cards">
                                    Cards
                                </TabsTrigger>
                                <TabsTrigger className="w-full" value="calendar">
                                    Calendar
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    <Button onClick={() => setIsAddModalOpen(true)}>Add Event</Button>
                    <AddCourseModal
                        open={isAddModalOpen}
                        onOpenChange={setIsAddModalOpen}
                        onAdded={() => refetch()}
                    />
                    <Upload 
                        open={isUploadModalOpen}
                        onOpenChange={setIsUploadModalOpen}
                        onAdded={() => refetch()} />
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
