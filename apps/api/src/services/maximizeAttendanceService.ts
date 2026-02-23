type AthletesMissing = string[] | Record<string, unknown>;

export interface AttendanceOption {
    athletesMissing?: AthletesMissing;
    [key: string]: unknown;
}

export interface AttendanceDay {
    date?: string;
    day?: string;
    options: AttendanceOption[];
}

export interface AttendanceScheduleEntry {
    day: string | undefined;
    option: AttendanceOption | null;
}

export function maximizeAttendanceService(days: AttendanceDay[]): AttendanceScheduleEntry[] {
    //Alg to to maximize attendance by minimizing athletes missing each day
    //Input: Array of days with options and athletes missing
    //Note: Input is different from DP algorithm
    //Output: Array of selected options for each day
    const schedule: AttendanceScheduleEntry[] = [];

    for (const day of days) {
        let bestOption = null;
        let minMissing = Infinity;

        for (const option of day.options) {
            const tempMissing = Array.isArray(option.athletesMissing)
                ? option.athletesMissing.length
                : Object.keys(option.athletesMissing || {}).length;

            if (tempMissing < minMissing) {
                minMissing = tempMissing;
                bestOption = option;
            }
        }

        schedule.push({
            day: day.date ?? day.day,
            option: bestOption
        });
    }

    return schedule;
}

// //Sample Test Data
// const days = [
//   {
//     date: "2025-01-06",
//     options: [
//       {
//         time: "4:00–5:00 PM",
//         athletesMissing: ["Alice", "Ben", "Carlos"]
//       },
//       {
//         time: "5:00–6:00 PM",
//         athletesMissing: ["Alice"]
//       },
//       {
//         time: "6:00–7:00 PM",
//         athletesMissing: ["Ben", "Carlos"]
//       },
//       {
//         time: "7:00–8:00 PM",
//         athletesMissing: []
//       }
//     ]
//   },
//   {
//     date: "2025-01-07",
//     options: [
//       {
//         time: "4:00–5:00 PM",
//         athletesMissing: ["Alice", "Ben"]
//       },
//       {
//         time: "5:00–6:00 PM",
//         athletesMissing: ["Carlos"]
//       },
//       {
//         time: "6:00–7:00 PM",
//         athletesMissing: ["Alice", "Carlos"]
//       },
//       {
//         time: "7:00–8:00 PM",
//         athletesMissing: []
//       }
//     ]
//   },
//   {
//     date: "2025-01-08",
//     options: [
//       {
//         time: "4:00–5:00 PM",
//         athletesMissing: ["Ben"]
//       },
//       {
//         time: "5:00–6:00 PM",
//         athletesMissing: ["Alice", "Ben"]
//       },
//       {
//         time: "6:00–7:00 PM",
//         athletesMissing: ["Carlos"]
//       },
//       {
//         time: "7:00–8:00 PM",
//         athletesMissing: ["Alice"]
//       }
//     ]
//   },
//   {
//     date: "2025-01-09",
//     options: [
//       {
//         time: "4:00–5:00 PM",
//         athletesMissing: ["Alice", "Ben", "Carlos"]
//       },
//       {
//         time: "5:00–6:00 PM",
//         athletesMissing: ["Ben"]
//       },
//       {
//         time: "6:00–7:00 PM",
//         athletesMissing: []
//       },
//       {
//         time: "7:00–8:00 PM",
//         athletesMissing: ["Carlos"]
//       }
//     ]
//   }
// ]
// const schedule = maximizeAttendanceService(days);

// console.debug("Final Practice Schedule:");
// schedule.forEach(entry => {
//     console.debug(
//         `Day: ${entry.day} | Time: ${entry.option?.time ?? "No option selected"} | Missing: ${entry.option?.athletesMissing.length ?? 0}`
//     );
// });
