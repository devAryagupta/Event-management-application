CREATE EXTENSION IF NOT EXISTS btree_gist;
CREATE TABLE IF NOT EXISTS participants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    event_id        UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    role            VARCHAR(20) NOT NULL DEFAULT 'attendee'
                        CHECK (role IN ('organizer', 'co-organizer', 'attendee')),
    during          TSTZRANGE NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, event_id),
    EXCLUDE USING gist (user_id WITH =, during WITH &&)
);
CREATE INDEX IF NOT EXISTS idx_participants_user ON participants(user_id);
CREATE INDEX IF NOT EXISTS idx_participants_event ON participants(event_id);