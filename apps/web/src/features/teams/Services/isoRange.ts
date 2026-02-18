export function startOfWeekISO(d = new Date()) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    const weekStart = new Date(date.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart.toISOString();
}

export function endOfWeekISO(d = new Date()) {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? 0 : 7); 
    const weekEnd = new Date(date.setDate(diff));
    weekEnd.setHours(23, 59, 59, 999);
    return weekEnd.toISOString();
}