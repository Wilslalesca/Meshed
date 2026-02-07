import { TeamEventType } from "./event";
export const TeamScheduleView = {
    Month: "dayGridMonth",
    Week: "timeGridWeek",
    Day: "timeGridDay",
} as const;
export type TeamScheduleView = (typeof TeamScheduleView)[keyof typeof TeamScheduleView];

export const TeamScheduleMode = {
  Calendar: "calendar",
  Heatmap: "heatmap",
} as const;
export type TeamScheduleMode = (typeof TeamScheduleMode)[keyof typeof TeamScheduleMode];


export type TeamScheduleEvent = {
    [x: string]: any;
    id: string;
    athleteId: string;
    athleteName: string;
    title: string;
    name: string;
    location?: string;
    startTime: Date;
    endTime: Date;
    description?: string;
    type: TeamEventType;
};


export type CourseTimeRow = {
  id: string;
  name: string | null;
  course_code: string | null;
  location: string | null;
  day_of_week: string;     
  start_time: Date;     
  end_time: Date;        
  start_date?: Date | null; 
  end_date?: Date | null;
  recurring?: boolean;
  term?: string | null;
};


export type TeamEventRow = {
  id: string;
  team_id: string;
  name?: string;
  type: TeamEventType;
  start_date: Date;   
  end_date?: Date | null;    
  start_time: Date;   
  end_time: Date;     
  reoccurring: boolean;
  reoccurr_type?: string | null;
  day_of_week?: string | null;
  opponent?: string | null;
  home_away?: string | null;
  lift_type?: string | null;
  notes?: string | null;
};
