import { useAuthStore } from '../store/authStore';
import { useEffect, useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { useMetaStore } from '../store/metaStore';
import { formatDatePart, formatDisplay, formatTimePart } from '../lib/datetime';
import EditEventModal from './EditEventModal';
import EventLogsModal from './EventLogsModal';
function EventsList() {
  const user = useAuthStore((s) => s.user);
  const updateTimezone = useAuthStore((s) => s.updateTimezone);
  const events = useEventStore((s) => s.events);
  const users = useEventStore((s) => s.users);
  const loading = useEventStore((s) => s.loading);
  const error = useEventStore((s) => s.error);
  const fetchEvents = useEventStore((s) => s.fetchEvents);
  const timezones = useMetaStore((s) => s.timezones);
  const fetchTimezones = useMetaStore((s) => s.fetchTimezones);

  const [editingEventId, setEditingEventId] = useState(null);
  const [logsEvent, setLogsEvent] = useState(null);

  const viewTimezone = user?.timezone || 'UTC';
  const usersById = Object.fromEntries(users.map((u) => [u.id, u]));

  useEffect(() => {
    fetchTimezones();
  }, [fetchTimezones]);

  async function handleTimezoneChange(e) {
    const next = e.target.value;
    try {
      await updateTimezone(next);
      await fetchEvents();
    } catch {
      // store already holds the error
    }
  }

  async function handleEditClose(result) {
    setEditingEventId(null);
    if (result?.refreshed) {
      await fetchEvents();
    }
  }

  return (
    <section className="dash-card events-card">
      <h2>Events</h2>

      <div className="field">
        <label htmlFor="view-timezone">View in Timezone</label>
        <select
          id="view-timezone"
          value={viewTimezone}
          onChange={handleTimezoneChange}
        >
          {!timezones.some((tz) => tz.value === viewTimezone) ? (
            <option value={viewTimezone}>{viewTimezone}</option>
          ) : null}
          {timezones.map((tz) => (
            <option key={tz.value} value={tz.value}>
              {tz.label}
            </option>
          ))}
        </select>
      </div>

      <div className="events-body">
        {error ? <p className="form-error">{error}</p> : null}
        {loading ? (
          <p className="empty-state">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="empty-state">No events found</p>
        ) : (
          <ul className="events-list">
            {events.map((event) => {
              // Organizer = user who created the meeting (events.organizer_id).
              const isOrganizer =
                Boolean(user?.id) &&
                Boolean(event.organizerId) &&
                String(event.organizerId) === String(user.id);

              const organizerName =
                usersById[event.organizerId]?.name ||
                (isOrganizer ? user?.name : 'Organizer');

              return (
                <li key={event.id} className="event-item">
                  <div className="event-title">{event.title || 'Untitled Event'}</div>
                  <p className="event-description">
                    {event.description || 'No description provided'}
                  </p>
                  <div className="event-location">
                    Location: {event.location || 'TBD'}
                  </div>
                  <div className="event-organizer">Organizer: {organizerName}</div>
                  <div className="event-times">
                    <div>
                      <strong>Start</strong>
                      <span>
                        {formatDatePart(event.startTime)} · {formatTimePart(event.startTime)}
                      </span>
                    </div>
                    <div>
                      <strong>End</strong>
                      <span>
                        {formatDatePart(event.endTime)} · {formatTimePart(event.endTime)}
                      </span>
                    </div>
                  </div>
                  <div className="event-meta">
                    <span>Created {formatDisplay(event.createdAt)}</span>
                    <span>Updated {formatDisplay(event.updatedAt)}</span>
                  </div>
                  <div className={`event-actions ${isOrganizer ? '' : 'event-actions-single'}`}>
                    {isOrganizer ? (
                      <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => setEditingEventId(event.id)}
                      >
                        Edit
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="ghost-btn"
                      onClick={() =>
                        setLogsEvent({ id: event.id, title: event.title || 'Untitled Event' })
                      }
                    >
                      View Logs
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {editingEventId ? (
        <EditEventModal eventId={editingEventId} onClose={handleEditClose} />
      ) : null}

      {logsEvent ? (
        <EventLogsModal
          eventId={logsEvent.id}
          eventTitle={logsEvent.title}
          onClose={() => setLogsEvent(null)}
        />
      ) : null}
    </section>
  );
}
export default EventsList;