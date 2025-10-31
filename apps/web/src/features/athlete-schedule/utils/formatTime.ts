
export function formatTime(time: string): string {

    if (!time) return '';

    const [hour, minute] = time.split(':');
    const h = parseInt(hour, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const adjustedHour = h % 12 === 0 ? 12 : h % 12;

    return `${adjustedHour}:${minute} ${suffix}`;
}