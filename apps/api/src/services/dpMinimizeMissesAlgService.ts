type AthleteMissesMap = Record<string, number>;

export interface DpPracticeOption {
    athletesMissing?: AthleteMissesMap;
    [key: string]: unknown;
}

export interface DpPracticeDay {
    options: DpPracticeOption[];
    [key: string]: unknown;
}

interface DpState {
    maxMisses: number;
    athleteMisses: AthleteMissesMap;
    currentSched: DpPracticeOption[];
}

export interface DpMinimizeMissesResult {
    schedule: DpPracticeOption[];
    maxMisses: number;
    athleteMisses: AthleteMissesMap;
}

export function dpMinimizeMissesAlgService(
    daysIn: DpPracticeDay[],
): DpMinimizeMissesResult {
    //Input: Array of days with practice options and athletes missing per option, identified by their athlete ID
    //Output: Schedule minimizing the maximum number of misses for any athlete

    if (daysIn.length === 0) {
        return {
            schedule: [],
            maxMisses: 0,
            athleteMisses: {},
        };
    }

    //Helper function for later to find the maximum value in an array safely
    function maxArrayValue(arr: number[]) {
        if (arr.length === 0) return 0;
        return Math.max(...arr);
    }

    function sumMisses(missesObj: AthleteMissesMap) {
        return Object.values(missesObj).reduce(
            (sum: number, val: number) => sum + val,
            0,
        );
    }

    //Initialize DP table
    const dp: DpState[][] = Array(daysIn.length);

    //Base case: Fill in for the first day
    dp[0] = daysIn[0].options.map((option) => {
        // Each athlete missing a practice for this option
        const athleteMisses: AthleteMissesMap = {
            ...(option.athletesMissing || {}),
        };
        return {
            maxMisses: maxArrayValue(Object.values(athleteMisses)),
            athleteMisses,
            currentSched: [option],
        };
    });

    //Fill DP table for subsequent days
    //Go through each day of the desired practice days
    for (let dayIndex = 1; dayIndex < daysIn.length; dayIndex++) {
        dp[dayIndex] = [];

        //Go through each practice option for the current day
        for (const currentOption of daysIn[dayIndex].options) {
            let bestPrevState: DpState | null = null;
            let bestMaxMisses = Infinity;

            //Compare with all previous day states
            for (const prevState of dp[dayIndex - 1]) {
                const combinedMisses = { ...prevState.athleteMisses }; //Array copy of previous individual athlete misses

                //Update combined misses with current option's misses
                const optionMisses = currentOption.athletesMissing || {};
                for (const [athleteId, misses] of Object.entries(
                    optionMisses,
                )) {
                    combinedMisses[athleteId] =
                        (combinedMisses[athleteId] || 0) + misses; //add this options misses to the athletes total or 0 if they haven't missed any yet
                }

                const currentMaxMisses = maxArrayValue(
                    Object.values(combinedMisses),
                );

                //Check if this previous state gives a better max misses
                if (
                    currentMaxMisses < bestMaxMisses ||
                    (currentMaxMisses === bestMaxMisses &&
                        (!bestPrevState ||
                            sumMisses(combinedMisses) <
                                sumMisses(bestPrevState.athleteMisses)))
                ) {
                    bestMaxMisses = currentMaxMisses;
                    bestPrevState = {
                        //Best previous state for this option on this day
                        maxMisses: currentMaxMisses,
                        athleteMisses: combinedMisses,
                        currentSched: prevState.currentSched.slice(), //copy previous schedule so you don't get mutation stuff
                    };
                }
            }

            //Store best found state for this option on this day
            dp[dayIndex].push({
                maxMisses: bestMaxMisses,
                athleteMisses: bestPrevState
                    ? { ...bestPrevState.athleteMisses }
                    : {},
                currentSched: bestPrevState
                    ? [...bestPrevState.currentSched, currentOption]
                    : [currentOption],
            });
        }
    }

    //Find best overall schedule from last day options
    const finalDayStates = dp[daysIn.length - 1];
    let bestOverall = finalDayStates[0];
    for (let stateIndex = 1; stateIndex < finalDayStates.length; stateIndex++) {
        if (finalDayStates[stateIndex].maxMisses < bestOverall.maxMisses) {
            bestOverall = finalDayStates[stateIndex];
        }
    }

    return {
        schedule: bestOverall.currentSched,
        maxMisses: bestOverall.maxMisses,
        athleteMisses: bestOverall.athleteMisses,
    };
}
