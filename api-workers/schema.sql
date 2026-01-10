CREATE TABLE IF NOT EXISTS autopilot_config (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  v8_enabled BOOLEAN NOT NULL,
  rollout_percentage INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_created_at ON autopilot_config(created_at DESC);

-- Початкове значення
INSERT INTO autopilot_config (v8_enabled, rollout_percentage) 
VALUES (false, 0);
