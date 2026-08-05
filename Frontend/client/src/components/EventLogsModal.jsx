import { useEffect, useState } from 'react';
import { useEventStore } from '../store/eventStore';
import { formatDisplay } from '../lib/datetime';
import { toUserMessage } from '../lib/errors';

function summarizeValue(value) {
  if (value == null) return '—';
  if (typeof value !== 'object') return String(value);

  const parts = [];
  if (value.title) parts.push(`Title: ${value.title}`);
  if (value.timezone) parts.push(`Timezone: ${value.timezone}`);
  if (value.startTime) parts.push(`Start: ${formatDisplay(value.startTime)}`);
  if (value.endTime) parts.push(`End: ${formatDisplay(value.endTime)}`);
  if (value.location) parts.push(`Location: ${value.location}`);
  if (value.userId) parts.push(`User: ${value.userId}`);
  if (value.role) parts.push(`Role: ${value.role}`);
  if (value.cancelled) parts.push('Cancelled');
  if (Array.isArray(value.profileIds) && value.profileIds.length) {
    parts.push(`Profiles: ${value.profileIds.length}`);
  }

  return parts.length ? parts.join(' · ') : 'Updated fields';
}

function EventLogsModal({ eventId, eventTitle, onClose }) {
  const fetchAuditLogs = useEventStore((s) => s.fetchAuditLogs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await fetchAuditLogs(eventId);
        if (!cancelled) setLogs(data);
      } catch (err) {
        if (!cancelled) {
          setError(toUserMessage(err, 'Could not load update history.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [eventId, fetchAuditLogs]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-panel modal-panel-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-logs-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="event-logs-title">Event Update History</h2>
            {eventTitle ? <p className="modal-subtitle">{eventTitle}</p> : null}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {loading ? (
          <p className="muted">Loading history...</p>
        ) : error ? (
          <p className="form-error">{error}</p>
        ) : logs.length === 0 ? (
          <p className="empty-state">No update history yet</p>
        ) : (
          <ul className="logs-list">
            {logs.map((log) => (
              <li key={log.id} className="log-item">
                <div className="log-top">
                  <strong>{log.changedType || 'UPDATE'}</strong>
                  <span>{formatDisplay(log.createdAt)}</span>
                </div>
                <div className="log-body">
                  <div>
                    <span className="log-label">Previous</span>
                    <p>{summarizeValue(log.previousValue)}</p>
                  </div>
                  <div>
                    <span className="log-label">Updated</span>
                    <p>{summarizeValue(log.newValue)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
export default EventLogsModal;