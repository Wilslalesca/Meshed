CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  password_hash TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sports_lookup (
  id SERIAL PRIMARY KEY,
  sport_name VARCHAR(100) NOT NULL,
  season VARCHAR(50),
  position VARCHAR(50)
);

CREATE TABLE league (
  id SERIAL PRIMARY KEY,
  league_name VARCHAR(100) NOT NULL
);

CREATE TABLE insights (
  id SERIAL PRIMARY KEY
);

CREATE TABLE teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  sport_id INT REFERENCES sports_lookup(id),
  season VARCHAR(50),
  insights_id INT REFERENCES insights(id),
  league_id INT REFERENCES league(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE user_teams (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id INT REFERENCES teams(id) ON DELETE CASCADE,
  role VARCHAR(50),
  position VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE athlete_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  school_name VARCHAR(100),
  year VARCHAR(20),
  notes TEXT
);

CREATE TABLE coach_profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(100),
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE course_times (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  course_code VARCHAR(50),
  location VARCHAR(100),
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  term VARCHAR(50),
  start_date VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE athlete_course_times (
  id SERIAL PRIMARY KEY,
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  class_id INT REFERENCES course_times(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coach_athlete_visibility (
  id SERIAL PRIMARY KEY,
  coach_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  input_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_log (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100),
  entity VARCHAR(50),
  entity_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
