export function formatTimeRange(
    start?: string | null,
    end?: string | null,
): string {
    if (start && end) return `${start} - ${end}`;
    if (start) return start;
    return "—";
}

export function parseHoursFromRange(time: string): number {
    if (!time.includes("-")) return 0;

    const [rawStart, rawEnd] = time.split("-").map((s) => s.trim());

    const parse = (value: string): number | null => {
        const normalized = value
            .replace(/\s+/g, " ")
            .replace(/([AP]M)$/i, " $1") 
            .toUpperCase()
            .trim();

        const match12 = normalized.match(/^(\d{1,2})(?::(\d{2}))?\s(AM|PM)$/);

        if (match12) {
            let hours = Number(match12[1]);
            const minutes = Number(match12[2] ?? "0");
            const period = match12[3];

            if (period === "PM" && hours !== 12) hours += 12;
            if (period === "AM" && hours === 12) hours = 0;

            return hours + minutes / 60;
        }

        const match24 = normalized.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);

        if (match24) {
            const hours = Number(match24[1]);
            const minutes = Number(match24[2]);
            const seconds = Number(match24[3] ?? "0");

            return hours + minutes / 60 + seconds / 3600;
        }

        return null;
    };

    const start = parse(rawStart);
    const end = parse(rawEnd);

    if (start === null || end === null) return 0;

    const diff = end - start;

    return diff > 0 ? diff : 0;
}

export function formatHoursToReadable(hours: number): string {
    const totalMinutes = Math.round(hours * 60);
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    

    if (h === 0) return `${m}min`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}min`;
}

export function toNumber(value: unknown): number | null {
    if (typeof value === "number" && Number.isFinite(value)) return value;

    if (typeof value === "string") {
        const parsed = Number(value);
        if (Number.isFinite(parsed)) return parsed;
    }

    return null;
}
