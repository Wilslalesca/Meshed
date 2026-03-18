export interface EventItem {
    id: string;
    title: string;
    date: string;
    time: string;
}

export type FacilityCalendarItem = {
  id: string,
  title: string,
  daysOfWeek: number[],
  startTime: string,
  endTime:string
};