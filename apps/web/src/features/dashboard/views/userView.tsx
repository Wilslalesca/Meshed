import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import { QuickActions } from "../components/user/QuickActions";
import { StatCard } from "../components/StatCard";
import { TeamSchedule } from "../components/user/TeamSchedule";
import { ActivityFeed } from "../components/user/ActivityFeed";
import { EventWidget } from "../components/EventWidget";
import { getAthleteEvents } from "../api/dashboardApi";
import { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { rendererRegistry, DynamicCrudSheet  } from "@/shared/components/dynamicSheet/dynamicSheet";
import type { SheetSchema, Errors, Values  } from "@/shared/components/dynamicSheet/dynamicSheet";
import { Button } from "@/shared/components/ui/button";




export const UserDashboard = () => {
    const [events, setEvents] = useState<
        Array<{ id: string; title: string; date: string; time: string }>
    >([]);
    const { user } = useAuth();
    const { token } = useAuth();
    useEffect(() => {
        if (user?.id) {
            getAthleteEvents(user.id, token!).then(setEvents);
        }
    }, [user?.id]);
    const testSchema: SheetSchema = {
        title: "Create Event (Test)",
        subtitle: "Testing the dynamic CRUD sheet renderer.",
        showProgress: true,
        fields: [
            {
            key: "title",
            label: "Title",
            hint: "Example: Practice, Lift, Study block",
            kind: "input",
            placeholder: "Event title...",
            },
            {
            key: "type",
            label: "Type",
            kind: "select",
            placeholder: "Choose a type",
            options: [
                { label: "Practice", value: "practice" },
                { label: "Game", value: "game" },
                { label: "Class", value: "class" },
            ],
            },
            {
            key: "date",
            label: "Date",
            kind: "date",
            placeholder: "Pick a date",
            },
            {
            key: "notes",
            label: "Notes",
            kind: "textarea",
            placeholder: "Optional notes...",
            rows: 4,
            },
            {
            key: "notify",
            label: "Notifications",
            hint: "Enable reminders for this event",
            kind: "switch",
            },
        ],
        };

    const initialValues = {
        title: "Team Practice",
        type: "practice",
        notify: true,
        // date: new Date(), // optional for prefill
        // notes: "Bring cones",
    };

    const handleSubmit = (values: Record<string, unknown>) => {
        console.log("Dynamic sheet submit:", values);
        // later: call createEvent/updateEvent
    };


    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Upcoming Classes"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
                <StatCard
                    title="Training Sessions"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
                <StatCard
                    title="Available Facilities"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
                <StatCard
                    title="Unread Messages"
                    value={null}
                    subtitle="No API connection"
                    loading={false}
                />
            </div>
            <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
                Dashboard controls
            </div>

            <DynamicCrudSheet
                schema={testSchema}
                initialValues={initialValues} // remove for "create"
                onSubmit={handleSubmit}
                trigger={<Button>Create Event</Button>}
            />
            </div>
            <QuickActions />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Your Team</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <TeamSchedule data={[]} />
                        </CardContent>
                    </Card>

                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Updates</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <ActivityFeed data={[]} />
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-4">
                    <EventWidget events={events} />
                </div>
            </div>
        </div>
    );
};
