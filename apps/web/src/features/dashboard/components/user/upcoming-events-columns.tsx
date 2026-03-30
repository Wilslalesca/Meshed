import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/shared/components/ui/badge";
import type { UpcomingEventRow } from "../../types/upcomingEventRow";
import { formatLocalDate } from "../../utils/date";

export const upcomingEventsColumns: ColumnDef<UpcomingEventRow>[] = [
    {
        accessorKey: "title",
        header: "Event",
        cell: ({ row }) => {
            return <div className="font-medium">{row.original.title}</div>;
        },
    },
    {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => {
            const value = row.original.date;
            return value ? formatLocalDate(value) : "—";
        },
    },
    {
        accessorKey: "time",
        header: "Time",
        cell: ({ row }) => {
            return row.original.time || "—";
        },
    },
    {
        accessorKey: "team",
        header: "Team",
        cell: ({ row }) => {
            return row.original.team || "—";
        },
    },
    {
        accessorKey: "location",
        header: "Location",
        cell: ({ row }) => {
            return row.original.location || "—";
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status;

            if (!status) return "—";

            if (status.toLowerCase() === "approved") {
                return (
                    <Badge className="bg-[#479572] text-white">{status}</Badge>
                );
            }

            if (status.toLowerCase() === "pending") {
                return <Badge variant="secondary">{status}</Badge>;
            }

            if (status.toLowerCase() === "denied") {
                return <Badge variant="destructive">{status}</Badge>;
            }

            return <Badge variant="outline">{status}</Badge>;
        },
    },
];
