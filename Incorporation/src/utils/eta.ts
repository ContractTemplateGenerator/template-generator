export function addBusinessDays(start: Date, days: number) {
  const d = new Date(start);
  let added = 0;
  while (added < days) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return d;
}
export function fmt(d: Date) {
  return d.toLocaleDateString(undefined, { month:"long", day:"numeric", year:"numeric" });
}