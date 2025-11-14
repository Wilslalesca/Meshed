import { ScheduleModel } from "../models/ScheduleModel";

export const ScheduleService = {
    async getScheduleForAthlete(athleteId: string) {
        // @ilsa, this will be where we will be calling the scheduler
        return await ScheduleModel.getAthleteSchedule(athleteId);
    },
};
