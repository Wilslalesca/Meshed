export interface CourseResponse {
    message: string,
    course_time: {
        id: number;
        name: string,
        course_code: string,
        location: string,
        day_of_week: string,
        start_time: string,
        end_time: string,
        term: string,
        start_date: string,
        end_date: string,
    };
    success: boolean;
}

export interface CourseTime {
  id: string;
  name?: string;
  course_code?: string;
  location?: string;
  day_of_week?: string;
  start_time?: string;
  end_time?: string;
  term?:string;
  start_date?: string;
  end_date?:string;
}

export interface ApiResponse {
    message: string,
    success: boolean
}