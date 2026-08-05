const { toViewerTime } = require('../../shared/timezone');

const AUDIT_TIMESTAMP_KEYS = new Set([
  'startTime',
  'endTime',
  'createdAt',
  'updatedAt',
]);

function mapEventForViewer(event, viewerTimezone = 'UTC') {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    location: event.location,
    timezone: event.timezone, // event context timezone (unchanged)
    organizerId: event.organizerId,
    // absolute truth (UTC)
    startTimeUtc: event.startTime,
    endTimeUtc: event.endTime,
    createdAtUtc: event.createdAt,
    updatedAtUtc: event.updatedAt,
    // viewer local display
    startTime: toViewerTime(event.startTime, viewerTimezone),
    endTime: toViewerTime(event.endTime, viewerTimezone),
    createdAt: toViewerTime(event.createdAt, viewerTimezone),
    updatedAt: toViewerTime(event.updatedAt, viewerTimezone),
    viewerTimezone,
  };
}

function mapEventsForViewer(events, viewerTimezone = 'UTC') {
  return events.map((e) => mapEventForViewer(e, viewerTimezone));
}

/**
 * Convert known timestamp fields inside audit previous/new JSON payloads
 * to the viewer's timezone, while preserving absolute UTC copies.
 */
function mapAuditPayload(value, viewerTimezone = 'UTC') {
  if (value == null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => mapAuditPayload(item, viewerTimezone));
  }

  const mapped = {};
  for (const [key, nested] of Object.entries(value)) {
    if (AUDIT_TIMESTAMP_KEYS.has(key) && nested != null) {
      mapped[`${key}Utc`] = nested;
      mapped[key] = toViewerTime(nested, viewerTimezone);
      continue;
    }
    if (nested != null && typeof nested === 'object') {
      mapped[key] = mapAuditPayload(nested, viewerTimezone);
      continue;
    }
    mapped[key] = nested;
  }
  return mapped;
}

function mapLogForViewer(log, viewerTimezone = 'UTC') {
  return {
    id: log.id,
    eventId: log.eventId,
    changedBy: log.changedBy,
    changedType: log.changedType,
    previousValue: mapAuditPayload(log.previousValue, viewerTimezone),
    newValue: mapAuditPayload(log.newValue, viewerTimezone),
    actorTimezone: log.actorTimezone,
    createdAtUtc: log.createdAt,
    createdAt: toViewerTime(log.createdAt, viewerTimezone),
    viewerTimezone,
  };
}

function mapLogsForViewer(logs, viewerTimezone = 'UTC') {
  return logs.map((l) => mapLogForViewer(l, viewerTimezone));
}

module.exports = {
  mapEventForViewer,
  mapEventsForViewer,
  mapLogForViewer,
  mapLogsForViewer,
  mapAuditPayload,
};
