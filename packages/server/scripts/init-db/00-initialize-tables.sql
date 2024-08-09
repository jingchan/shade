-- Table to store users
CREATE TABLE Account (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to store sessions for users
CREATE TABLE Sessions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES Account (id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Table to store shader projects with owner information
CREATE TABLE Project (
  id SERIAL PRIMARY KEY,
  owner_id INT REFERENCES Account (id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- -- Table to store shader files within a project
-- CREATE TABLE ProjectFile (
--   id SERIAL PRIMARY KEY,
--   project_id INT REFERENCES Project (id) ON DELETE CASCADE,
--   name VARCHAR(255) NOT NULL,
--   content TEXT NOT NULL,
--   created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
-- );
