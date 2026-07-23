CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT UNIQUE,
  email TEXT,
  password_hash TEXT,
  role TEXT NOT NULL CHECK(role IN ('citizen','government')),
  dept TEXT,
  emp_id TEXT,
  points INTEGER DEFAULT 0,
  verified_count INTEGER DEFAULT 0,
  issues_count INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clusters (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  center_lat REAL NOT NULL,
  center_lng REAL NOT NULL,
  ward TEXT,
  unique_reporter_count INTEGER DEFAULT 1,
  escalation_tier TEXT DEFAULT 'Normal',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  cluster_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  department TEXT,
  photo_url TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  ward TEXT,
  landmark TEXT,
  severity_score REAL,
  urgency_level TEXT,
  status TEXT DEFAULT 'Reported',
  stage INTEGER DEFAULT 0,
  votes INTEGER DEFAULT 0,
  sla_hours INTEGER,
  sla_deadline TEXT,
  language TEXT DEFAULT 'en',
  resolution_photo_url TEXT,
  audit_status TEXT DEFAULT 'Pending',
  audit_notes TEXT,
  ai_summary TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  resolved_at TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS complaint_verifications (
  complaint_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  PRIMARY KEY (complaint_id, user_id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  complaint_id TEXT,
  agent TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_complaints_category ON complaints(category);
CREATE INDEX IF NOT EXISTS idx_complaints_cluster ON complaints(cluster_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
