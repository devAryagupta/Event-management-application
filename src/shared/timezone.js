const { DateTime } = require('luxon');
function toViewerTime(utcValue, timezone = 'UTC') {
  if (!utcValue) return null;
  const dt = DateTime.fromJSDate(new Date(utcValue), { zone: 'utc' }).setZone(timezone);
  if (!dt.isValid) {
    return DateTime.fromJSDate(new Date(utcValue), { zone: 'utc' }).toISO();
  }
  return dt.toISO();
}
function isValidTimezone(timezone) {
  return Boolean(timezone) && DateTime.now().setZone(timezone).isValid;
}
function listSupportedTimezones() {
  const supportsIntlZones = typeof Intl?.supportedValuesOf === 'function';
  const intlZones = supportsIntlZones ? Intl.supportedValuesOf('timeZone') : [];
  const unique = new Set(['UTC', ...intlZones]);
  return [...unique].sort((a, b) => a.localeCompare(b)).map((value) => ({ value, label: value }));
}
module.exports = { toViewerTime, isValidTimezone, listSupportedTimezones };