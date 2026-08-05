import { useEffect, useMemo, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useEventStore } from '../store/eventStore';
import { useMetaStore } from '../store/metaStore';
import { toUtcIso } from '../lib/datetime';
import { toUserMessage } from '../lib/errors';

function CreateEventForm() {
  const currentUser = useAuthStore((s) => s.user);
  const users = useEventStore((s) => s.users);
  const creating = useEventStore((s) => s.creating);
  const createEvent = useEventStore((s) => s.createEvent);
  const timezones = useMetaStore((s) => s.timezones);
  const fetchTimezones = useMetaStore((s) => s.fetchTimezones);

  const otherUsers = useMemo(
    () => users.filter((u) => u.id !== currentUser?.id),
    [users, currentUser?.id]
  );

  const [profileIds, setProfileIds] = useState([]);
  const [profilesOpen, setProfilesOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [timezone, setTimezone] = useState(
    currentUser?.timezone || 'UTC'
  );
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('09:00');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    fetchTimezones();
  }, [fetchTimezones]);

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
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedLocation = location.trim();

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
      await createEvent({
        title: normalizedTitle,
        description: normalizedDescription || null,
        location: normalizedLocation || null,
        timezone,
        startTime: startTimeUtc,
        endTime: endTimeUtc,
        profileIds,
      });

      setTitle('');
      setDescription('');
      setLocation('');
      setProfileIds([]);
      setStartDate('');
      setEndDate('');
      setStartTime('09:00');
      setEndTime('09:00');
      setProfilesOpen(false);
    } catch (err) {
      setLocalError(toUserMessage(err, 'Could not create event. Please try again.'));
    }
  }

  return (
    <section className="dash-card create-card">
      <h2>Create Event</h2>

      <form className="create-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="event-title">Meeting Title</label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter meeting title"
            required
          />
        </div>

        <div className="field">
          <label htmlFor="event-description">Description</label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add meeting details"
            rows={3}
          />
        </div>

        <div className="field">
          <label htmlFor="event-location">Location</label>
          <input
            id="event-location"
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
          <label htmlFor="event-timezone">Timezone</label>
          <select
            id="event-timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          >
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

        <button type="submit" className="primary-btn" disabled={creating}>
          {creating ? 'Creating...' : '+ Create Event'}
        </button>
      </form>
    </section>
  );
}

export default CreateEventForm;