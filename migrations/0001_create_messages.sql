CREATE TABLE IF NOT EXISTS messages (
id INTEGER PRIMARY KEY AUTOINCREMENT,
message TEXT NOT NULL,
display_name TEXT,
status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
created_at TEXT NOT NULL DEFAULT (datetime('now')),
reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_messages_status_created ON messages(status, created_at);
INSERT INTO messages (message, display_name, status, created_at) VALUES
('You are not alone in what you’re feeling.', 'Understanding Trauma', 'approved', datetime('now')),
('You are allowed to take this day one breath at a time.', 'Understanding Trauma', 'approved', datetime('now')),
('You do not have to earn rest. You are allowed to receive it.', 'Understanding Trauma', 'approved', datetime('now')),
('A hard day does not mean a hopeless life.', 'Understanding Trauma', 'approved', datetime('now'));
