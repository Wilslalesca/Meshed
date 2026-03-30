import { DataTable } from "@/shared/components/data-table";
import { upcomingEventsColumns } from "./upcoming-events-columns";
import type { UpcomingEventRow } from "../../types/upcomingEventRow";

interface UpcomingEventsTableProps {
  data: UpcomingEventRow[];
}

export const UpcomingEventsTable = ({ data }: UpcomingEventsTableProps) => {
  return <DataTable columns={upcomingEventsColumns} data={data} />;
};