import { useAuth } from "@/shared/hooks/useAuth";
import { apiAddTeamEvent } from "../api/events";
import { TeamEventFactoryRegistry } from "../types/factories/registry";
import type { TeamEventType } from "../types/event";

const weekdays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

export const useAddTeamEvent = () => {
  const { token } = useAuth();

    const formatLocalDate = (d: Date) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
    };

  const addTeamEvent = async (
    teamId: string,
    teamFacilityId: string | undefined,
    eventName: string | undefined,
    startDate: Date,
    endDate: Date | null,
    startTime: string,
    endTime: string,
    reoccurring: boolean,
    selectedReoccurrType: "Daily" | "Weekly" | "Bi-Weekly" | "Monthly" | undefined,
    selectedDays: string[],
    status: string,
    opponent: string| undefined,
    homeAway: "Home" | "Away" | undefined,
    notes: string| undefined,
    liftType: string| undefined,
    eventTypeID: TeamEventType
  ) => {
      const weekdayIndex = (d: Date) => (d.getDay() + 6) % 7;
      const FactoryClass = TeamEventFactoryRegistry[eventTypeID];
      const eventDates: Date[] = [];
      const msPerDay = 24 * 60 * 60 * 1000;

      if (reoccurring) {
          const start = new Date(startDate as Date);
          const end = new Date(endDate as Date);

          for (let d = new Date(start); d <= end; d = new Date(d.getTime() + msPerDay)) {
              const diffDays = Math.floor((d.getTime() - start.getTime()) / msPerDay);
              const wkName = weekdays[weekdayIndex(d)];

              if (selectedReoccurrType === "Daily") {
                  eventDates.push(new Date(d));
              } else if (selectedReoccurrType === "Weekly" || selectedReoccurrType === "Bi-Weekly") {
                  // If user selected specific weekdays, enforce them, otherwise accept every day
                  if (selectedDays.length && !selectedDays.includes(wkName)) continue;
                  const intervalWeeks = selectedReoccurrType === "Weekly" ? 1 : 2;
                  const weekIndex = Math.floor(diffDays / 7);
                  if (weekIndex % intervalWeeks === 0) {
                      eventDates.push(new Date(d));
                  }
              } else if (selectedReoccurrType === "Monthly") {
                  if (d.getDate() === start.getDate()) {
                      eventDates.push(new Date(d));
                  }
              }
          }
      } else {
          const start = new Date(startDate as Date);
          eventDates.push(start);
      }

      for (const date of eventDates) {
          const factory = new FactoryClass({
              teamId: teamId,
              teamFacilityId: teamFacilityId,
              name: eventName,
              startDate: formatLocalDate(date),
              endDate: endDate ? formatLocalDate(endDate) : undefined,
              startTime: startTime,
              endTime: endTime,
              reoccurring: reoccurring,
              reoccurrType: selectedReoccurrType,
              dayOfWeek: weekdays[weekdayIndex(date)],
              status: status,
              opponent: opponent,
              homeAway: homeAway,
              notes: notes,
              liftType: liftType,
          });

          const event = factory.createEvent();
          try {
            if (!token) return;
            await apiAddTeamEvent(event, token);
          } 
          catch (error) {
              return(error instanceof Error ? error.message : "An error occurred");
          }
    }
  }
  return { addTeamEvent };
};
