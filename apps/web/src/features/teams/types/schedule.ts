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
    id: string;
    athleteId: string;
    athleteName: string;
    title: string;
    location?: string;
    startTime: string;
    endTime: string;
    description?: string;
    type: "class" | "practice" | "meeting" | "other" | "team_event";
};


export type CourseTimeRow = {
  id: string;
  name: string | null;
  course_code: string | null;
  location: string | null;
  day_of_week: string;     
  start_time: string;     
  end_time: string;        
  start_date?: string | null; 
  end_date?: string | null;
  recurring?: boolean;
  term?: string | null;
};


export type TeamEventRow = {
  id: string;
  team_id: string;
  type: string;
  start_date: string;   
  end_date?: string | null;    
  start_time: string;   
  end_time: string;     
  reoccurring: boolean;
  reoccurr_type?: string | null;
  day_of_week?: string | null;
  opponent?: string | null;
  home_away?: string | null;
  lift_type?: string | null;
  notes?: string | null;
};
