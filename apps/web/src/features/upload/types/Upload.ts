export interface UploadResponse {
    message: string,
    course_times?: {
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
        recurring: boolean,
    } [];
    schedule: boolean
}