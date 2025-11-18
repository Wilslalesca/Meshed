function minimizeMissesService(days){
    if(!days || days.length === 0){
        return {schedule:[], maxMisses: 0};
    }

    const safeMax = arr => (arr.length ? Math.max(...arr) : 0);

    const dp = Array(days.length);

    //Initialize for day 0
    dp[0] = days[0].options.map(option => {
        const athleteMisses = { ...(option.athletesMissing || {})};
        return {
            maxMisses: safeMax(Object.values(athleteMisses)),
            athleteMisses,
            path: [option]
        };
    });

    for(let i = 1; i < days.length; i++){
        dp[i] = [];

        for (let currentOption of days[i].options) {
            let bestPrev = null;
            let bestMaxMisses = Infinity;

            for (let prevState of dp[i-1]){
                const combinedMisses = { ...prevState.athleteMisses };

                for (const [athleteId, misses] of Object.entries(currentOption.athletesMissing || {})){
                    combinedMisses[athleteId] = (combinedMisses[athleteId] || 0) + misses;
                }

                const currentMax = safeMax(Object.values(combinedMisses));

                if (currentMax < bestMaxMisses) {
                    bestMaxMisses = currentMax;
                    bestPrev = {
                        maxMisses: currentMax,
                        athleteMisses: combinedMisses,
                        path: prevState.path.slice()
                    };
                }
            }

            dp[i].push({
                maxMisses: bestMaxMisses,
                athleteMisses: bestPrev ? { ...bestPrev.athleteMisses } : {},
                path: bestPrev ? [...bestPrev.path, currentOption] : [currentOption]
            });
        }
    }
    const finalDay = dp[days.length - 1];
    let best = finalDay[0];

    for (let k = 1; k < finalDay.length; k++) {
        if (finalDay[k].maxMisses < best.maxMisses) {
            best = finalDay[k];
        }
    }

    return {
        schedule: best.path,
        maxMisses: best.maxMisses,
        athleteMisses: best.athleteMisses
    };
}