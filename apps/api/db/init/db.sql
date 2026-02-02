CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  password_hash TEXT NOT NULL,
  active BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sports_lookup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_name VARCHAR(100) NOT NULL,
  season VARCHAR(50),
  position VARCHAR(50)
);

CREATE TABLE league (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  league_name VARCHAR(100) NOT NULL
);

CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  sport_id UUID REFERENCES sports_lookup(id),
  season VARCHAR(50),
  insights_id UUID REFERENCES insights(id),
  league_id UUID REFERENCES league(id),
  gender VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR,
  type VARCHAR NOT NULL,          
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reoccurring BOOLEAN NOT NULL,
  reoccurr_type VARCHAR,        
  day_of_week VARCHAR(20),           
  opponent VARCHAR,                
  home_away VARCHAR,               
  lift_type VARCHAR,               
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                  
);

CREATE TABLE user_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  role VARCHAR(50),
  position VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, team_id)
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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100),
  course_code VARCHAR(50),
  location VARCHAR(100),
  day_of_week VARCHAR(20),
  start_time TIME,
  end_time TIME,
  term VARCHAR(50),
  start_date VARCHAR(100),
  end_date VARCHAR(100),
  recurring BOOLEAN DEFAULT FALSE,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- user_course_times: Links any user to any course_time (many-to-many).
-- Supports any user type (athletes, patients, customers, staff, etc.)
CREATE TABLE IF NOT EXISTS user_course_times (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES course_times(id) ON DELETE CASCADE,
  meta JSONB DEFAULT '{}'::jsonb,  -- Sector-specific overrides (role context, notes, etc.)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, class_id)  -- Prevent duplicate links
);

-- Performance indexes for user_course_times
-- Fast lookup by user ("show me my schedule")
CREATE INDEX IF NOT EXISTS idx_user_course_times_user ON user_course_times(user_id);
-- Fast lookup by course ("who is enrolled in this course")
CREATE INDEX IF NOT EXISTS idx_user_course_times_class ON user_course_times(class_id);
-- GIN index for flexible JSONB queries on course-level metadata (e.g., sector-specific fields)
CREATE INDEX IF NOT EXISTS idx_course_times_meta_gin ON course_times USING GIN (meta);
-- GIN index for link-level metadata queries (e.g., per-user overrides, role context)
CREATE INDEX IF NOT EXISTS idx_user_course_times_meta_gin ON user_course_times USING GIN (meta);

CREATE TABLE coach_athlete_visibility (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES coach_profiles(id) ON DELETE CASCADE,
  athlete_id UUID REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  input_source VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100),
  entity VARCHAR(50),
  entity_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  address1 VARCHAR(100),
  address2 VARCHAR(100),
  city VARCHAR(50),
  province_state VARCHAR(50),
  postal_code VARCHAR(20),
  country VARCHAR(50),
  email VARCHAR(255),
  phone VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE team_facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  is_home BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  role VARCHAR(50),
  position VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  accepted_at TIMESTAMP
);

CREATE TABLE team_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  role VARCHAR(50),
  status VARCHAR(50) DEFAULT 'active',
  notes VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, team_id)
);

CREATE TABLE email_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes'),
  used BOOLEAN DEFAULT FALSE
);

-- Notifications for UI/email alerts
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

