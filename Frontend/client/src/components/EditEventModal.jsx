import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import { useMetaStore } from '../store/metaStore';
import { splitInTimezone, toUtcIso } from '../lib/datetime';
import { toUserMessage } from '../lib/errors';

function EditEventModal({ eventId, onClose }) {
  const currentUser = useAuthStore((s) => s.user);
  const users = useEventStore((s) => s.users);
  const updating = useEventStore((s) => s.updating);
  const getEvent = useEventStore((s) => s.getEvent);
  const updateEvent = useEventStore((s) => s.updateEvent);
  const syncAttendees = useEventStore((s) => s.syncAttendees);
  const timezones = useMetaStore((s) => s.timezones);
  const fetchTimezones = useMetaStore((s) => s.fetchTimezones);

  const [loading, setLoading] = useState(true);
  const [localError, setLocalError] = useState('');
  const [organizerId, setOrganizerId] = useState(null);

  const [profileIds, setProfileIds] = useState([]);
  const [profilesOpen, setProfilesOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState(currentUser?.timezone || 'UTC');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');

  const otherUsers = useMemo(
    () => users.filter((u) => u.id !== currentUser?.id),
    [users, currentUser?.id]
  );

  useEffect(() => {
    fetchTimezones();
  }, [fetchTimezones]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLocalError('');
      try {
        const { event, participants } = await getEvent(eventId);

        if (cancelled) return;

        if (
          !currentUser?.id ||
          !event.organizerId ||
          String(event.organizerId) !== String(currentUser.id)
        ) {
          setLocalError('Only the organizer can edit this meeting.');
          setLoading(false);
          return;
        }

        const zone = event.timezone || currentUser?.timezone || 'UTC';
        const startParts = splitInTimezone(event.startTimeUtc || event.startTime, zone);
        const endParts = splitInTimezone(event.endTimeUtc || event.endTime, zone);

        setOrganizerId(event.organizerId);
        setTitle(event.title || '');
        setDescription(event.description || '');
        setLocation(event.location || '');
        setTimezone(zone);
        setStartDate(startParts.date);
        setStartTime(startParts.time || '09:00');
        setEndDate(endParts.date);
        setEndTime(endParts.time || '09:00');
        setProfileIds(
          participants
            .filter((p) => p.userId !== event.organizerId)
            .map((p) => p.userId)
        );
      } catch (err) {
        if (!cancelled) {
          setLocalError(toUserMessage(err, 'Could not load this meeting.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [eventId, currentUser?.id, currentUser?.timezone, getEvent]);

  function toggleProfile(id) {
    setProfileIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  const profilesLabel =
    profileIds.length === 0
      ? 'Select profiles...'
      : `${profileIds.length} profile${profileIds.length > 1 ? 's' : ''} selected`;

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError('');

    if (organizerId && organizerId !== currentUser?.id) {
      setLocalError('Only the organizer can edit this meeting.');
      return;
    }

    const normalizedTitle = title.trim();
    if (!normalizedTitle) {
      setLocalError('Meeting title is required.');
      return;
    }

    const startTimeUtc = toUtcIso(startDate, startTime, timezone);
    const endTimeUtc = toUtcIso(endDate || startDate, endTime, timezone);

    if (!startTimeUtc || !endTimeUtc) {
      setLocalError('Please pick valid start and end date/time.');
      return;
    }

    if (new Date(endTimeUtc) <= new Date(startTimeUtc)) {
      setLocalError('End time must be after start time.');
      return;
    }

    try {
      await updateEvent(eventId, {
        title: normalizedTitle,
        description: description.trim() || null,
        location: location.trim() || null,
        timezone,
        startTime: startTimeUtc,
        endTime: endTimeUtc,
      });

      await syncAttendees(eventId, profileIds, organizerId || currentUser.id);
      onClose({ refreshed: true });
    } catch (err) {
      setLocalError(toUserMessage(err, 'Could not update event. Please try again.'));
    }
  }

  return (
    <div className="modal-backdrop" onClick={() => onClose()}>
      <div
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-event-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="edit-event-title">Edit Event</h2>
          <button type="button" className="modal-close" onClick={() => onClose()} aria-label="Close">
            ×
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading meeting details...</p>
        ) : localError && !organizerId ? (
          <>
            <p className="form-error">{localError}</p>
            <div className="modal-actions">
              <button type="button" className="ghost-btn" onClick={() => onClose()}>
                Close
              </button>
            </div>
          </>
        ) : (
          <form className="create-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="edit-event-title-input">Meeting Title</label>
              <input
                id="edit-event-title-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="edit-event-description">Description</label>
              <textarea
                id="edit-event-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add meeting details"
                rows={3}
              />
            </div>

            <div className="field">
              <label htmlFor="edit-event-location">Location</label>
              <input
                id="edit-event-location"
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Office / Zoom / Google Meet"
              />
            </div>

            <div className="field">
              <label>Profiles</label>
              <div className="multi-select">
                <button
                  type="button"
                  className="select-trigger"
                  onClick={() => setProfilesOpen((v) => !v)}
                >
                  <span>{profilesLabel}</span>
                  <span aria-hidden="true">▾</span>
                </button>

                {profilesOpen ? (
                  <div className="multi-select-menu">
                    {otherUsers.length === 0 ? (
                      <p className="muted">No other users yet</p>
                    ) : (
                      otherUsers.map((user) => (
                        <label key={user.id} className="check-row">
                          <input
                            type="checkbox"
                            checked={profileIds.includes(user.id)}
                            onChange={() => toggleProfile(user.id)}
                          />
                          {user.name}
                        </label>
                      ))
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="field">
              <label htmlFor="edit-event-timezone">Timezone</label>
              <select
                id="edit-event-timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
              >
                {!timezones.some((tz) => tz.value === timezone) ? (
                  <option value={timezone}>{timezone}</option>
                ) : null}
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label>Start Date & Time</label>
              <div className="datetime-row">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>End Date & Time</label>
              <div className="datetime-row">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            {localError ? <p className="form-error">{localError}</p> : null}

            <div className="modal-actions">
              <button type="button" className="ghost-btn" onClick={() => onClose()}>
                Cancel
              </button>
              <button type="submit" className="primary-btn" disabled={updating}>
                {updating ? 'Updating...' : 'Update Event'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
export default EditEventModal;