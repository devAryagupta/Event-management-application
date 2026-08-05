
ALTER TABLE audit_logs DROP CONSTRAINT IF EXISTS audit_logs_event_id_fkey;
ALTER TABLE audit_logs ALTER COLUMN event_id DROP NOT NULL;
ALTER TABLE audit_logs
  ADD CONSTRAINT audit_logs_event_id_fkey
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL;
