
export type UpcomingEventRow = {
  id: string;
  title: string;
  date: string;
  time: string;
  team?: string | null;
  location?: string | null;
  status?: string | null;
};