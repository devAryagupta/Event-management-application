export const DEFAULT_TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'America/New_York' },
  { value: 'America/Chicago', label: 'America/Chicago' },
  { value: 'America/Denver', label: 'America/Denver' },
  { value: 'America/Los_Angeles', label: 'America/Los_Angeles' },
  { value: 'Europe/London', label: 'Europe/London' },
  { value: 'Europe/Paris', label: 'Europe/Paris' },
  { value: 'Asia/Kolkata', label: 'Asia/Kolkata' },
  { value: 'Asia/Dubai', label: 'Asia/Dubai' },
  { value: 'Asia/Singapore', label: 'Asia/Singapore' },
  { value: 'Asia/Tokyo', label: 'Asia/Tokyo' },
  { value: 'Australia/Sydney', label: 'Australia/Sydney' },
];
export function normalizeTimezones(timezones) {
  if (!Array.isArray(timezones)) return DEFAULT_TIMEZONES;
  const clean = timezones
    .filter((tz) => tz && typeof tz.value === 'string' && tz.value)
    .map((tz) => ({
      value: tz.value,
      label: typeof tz.label === 'string' && tz.label ? tz.label : tz.value,
    }));
  return clean.length > 0 ? clean : DEFAULT_TIMEZONES;
}

export function timezoneLabel(value, timezones = DEFAULT_TIMEZONES) {
  return timezones.find((tz) => tz.value === value)?.label || value;
}