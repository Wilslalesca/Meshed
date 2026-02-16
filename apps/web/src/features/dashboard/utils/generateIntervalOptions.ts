type IntervalOption = {
    start: string;
    end: string;
}

export function generateIntervalOptions(
    startTime: string,
    endTime: string,
    durationMinutes: number
): IntervalOption[] {
    const options: IntervalOption[] = [];

    const toMinutes = (time: string) => {
        const [h,m] = time.split(":").map(Number);
        return h * 60 + m;
    };

    const timeString = (minutes: number)=> {
        const h = Math.floor(minutes /60);
        const m = minutes % 60;
        return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
    };

    let currentStart = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    while (currentStart + durationMinutes <= endMinutes) {
        options.push({
            start: timeString(currentStart),
            end: timeString(currentStart + durationMinutes),
        });
        currentStart += 30;
    }
    return options;
}