import { DateTime } from 'luxon';

export function toUtcIso(date, time, timezone) {
  if (!date || !time || !timezone) return null;

  const dt = DateTime.fromISO(`${date}T${time}`, { zone: timezone });
  if (!dt.isValid) return null;

  return dt.toUTC().toISO();
}

/** Split an absolute ISO instant into date/time inputs for a given zone. */
export function splitInTimezone(isoValue, timezone = 'UTC') {
  if (!isoValue) return { date: '', time: '' };

  const dt = DateTime.fromISO(isoValue, { setZone: true }).setZone(timezone || 'UTC');
  if (!dt.isValid) return { date: '', time: '' };

  return {
    date: dt.toFormat('yyyy-MM-dd'),
    time: dt.toFormat('HH:mm'),
  };
}

export function formatDisplay(isoValue) {
  if (!isoValue) return '—';

  const dt = DateTime.fromISO(isoValue, { setZone: true });
  if (!dt.isValid) return isoValue;

  return dt.toFormat("MMM d, yyyy 'at' hh:mm a");
}

export function formatDatePart(isoValue) {
  if (!isoValue) return '—';
  const dt = DateTime.fromISO(isoValue, { setZone: true });
  if (!dt.isValid) return isoValue;
  return dt.toFormat('MMM d, yyyy');
}

export function formatTimePart(isoValue) {
  if (!isoValue) return '—';
  const dt = DateTime.fromISO(isoValue, { setZone: true });
  if (!dt.isValid) return isoValue;
  return dt.toFormat('hh:mm a');
}