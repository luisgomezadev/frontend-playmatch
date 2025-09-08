import { TimeSlot } from '@reservation/interfaces/reservation';

export function to24h(time: string): string {
  const [hm, suffix] = time.split(' ');
  const [hours, minutes] = hm.split(':').map(Number);
  let h = hours % 12;
  if (suffix === 'PM') h += 12;
  return `${h.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

export function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const suffix = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 === 0 ? 12 : h % 12;
  return `${displayHours}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function toDateFromFormatted(time: string): Date {
  const [hm, suffix] = time.split(' ');
  const [hours, minutes] = hm.split(':').map(Number);
  let h = hours % 12;
  if (suffix === 'PM') h += 12;
  const date = new Date();
  date.setHours(h, minutes, 0, 0);
  return date;
}

export function toHourOnlyDate(time: string): Date {
  const [hours] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hours, 0, 0, 0);
  return date;
}

export function generateHourRanges(timeSlots: { start: string; end: string }[]): TimeSlot[] {
  const ranges: TimeSlot[] = [];
  timeSlots.forEach(slot => {
    let start = toHourOnlyDate(slot.start);
    const end = toHourOnlyDate(slot.end);

    while (start.getTime() + 60 * 60 * 1000 <= end.getTime()) {
      const next = new Date(start.getTime());
      next.setHours(next.getHours() + 1);

      ranges.push({ start: formatTime(start), end: formatTime(next) });
      start = next;
    }
  });
  return ranges;
}

export function filterPastHours(hours: TimeSlot[], selectedDate: Date): TimeSlot[] {
  const now = new Date();
  const isToday =
    selectedDate.getFullYear() === now.getFullYear() &&
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getDate() === now.getDate();

  if (!isToday) return hours;

  return hours.filter(h => toDateFromFormatted(h.start).getTime() > now.getTime());
}
