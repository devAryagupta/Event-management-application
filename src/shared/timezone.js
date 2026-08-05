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
module.exports = { toViewerTime, isValidTimezone };