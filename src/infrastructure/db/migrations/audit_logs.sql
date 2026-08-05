CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    changed_by      UUID NOT NULL REFERENCES users(id),
    change_type     VARCHAR(50) NOT NULL,
    previous_value  JSONB,
    new_value       JSONB NOT NULL,
    actor_timezone  VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_audit_event ON audit_logs(event_id);