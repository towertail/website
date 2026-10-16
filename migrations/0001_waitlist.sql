CREATE TABLE waitlist (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  hosts TEXT NOT NULL CHECK (hosts IN ('1-5', '6-20', '21-100', '100+')),
  source TEXT,  -- page path
  country TEXT, -- request.cf.country
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
