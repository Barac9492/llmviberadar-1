-- queries table
CREATE TABLE IF NOT EXISTS queries (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  category VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);

-- responses table
CREATE TABLE IF NOT EXISTS responses (
  id SERIAL PRIMARY KEY,
  query_id INTEGER REFERENCES queries(id) ON DELETE CASCADE,
  model_name VARCHAR(50) NOT NULL,
  response_text TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW()
);

-- rankings table
CREATE TABLE IF NOT EXISTS rankings (
  id SERIAL PRIMARY KEY,
  response_id INTEGER REFERENCES responses(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  rank INTEGER NOT NULL,
  score DECIMAL
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_responses_query_id ON responses(query_id);
CREATE INDEX IF NOT EXISTS idx_responses_timestamp ON responses(timestamp);
CREATE INDEX IF NOT EXISTS idx_rankings_response_id ON rankings(response_id);
