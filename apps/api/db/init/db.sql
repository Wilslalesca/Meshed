

-- Needed for gen_random_uuid(), crypt(), gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;


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

CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'Pro',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organization_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (organization_id, user_id)
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
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  sport_id UUID REFERENCES sports_lookup(id),
  season VARCHAR(50),
  insights_id UUID REFERENCES insights(id),
  league_id UUID REFERENCES league(id),
  gender VARCHAR(20),
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
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,  -- if a user is deleted it doesn't remove the course <- can remove this comment on review. did this so that if a user is deleted it doesn't remove the course for other users sharing it
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Links a user (any role) to a course_time entry for personal scheduling.
-- Replaces the old athlete_course_times table which required a row in athlete_profiles.
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES course_times(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  action VARCHAR(100),
  entity VARCHAR(50),
  entity_id UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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

CREATE TABLE team_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  team_facility_id UUID REFERENCES facilities(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  requested_by_user_id UUID REFERENCES users(id),
  name VARCHAR,
  type VARCHAR NOT NULL,          
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  reoccurring BOOLEAN NOT NULL,
  reoccurr_type VARCHAR,        
  day_of_week VARCHAR(20), 
  status VARCHAR,         
  opponent VARCHAR,                
  home_away VARCHAR,               
  lift_type VARCHAR,               
  notes TEXT,
  facility_notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                  
);

CREATE TABLE invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
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


-- CREATE INDEX IF NOT EXISTS idx_facilities_name ON facilities (name);

-- Notifications for UI/email alerts
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  meta JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);

CREATE TABLE team_event_email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_event_id UUID NOT NULL REFERENCES team_events(id) ON DELETE CASCADE,
  email_type VARCHAR(50) NOT NULL,
  recipient_email VARCHAR(255) NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (team_event_id, email_type, recipient_email)
);


-- ---------------------------------------------------------------------------
-- DEV SEED (idempotent)
-- Creates a dev org + team and links a manager + roster users for UI testing.
-- NOTE: Docker's init scripts only run on a fresh database volume.
-- ---------------------------------------------------------------------------

DO $$
DECLARE
  org_id UUID;
  team_id UUID;
  manager_id UUID;
  athlete_id UUID;
BEGIN
  -- Organization
  INSERT INTO organizations (name, slug, plan, active, created_at, updated_at)
  VALUES ('Meshed Dev Org', 'meshed-dev-org', 'Pro', TRUE, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE
    SET updated_at = NOW()
  RETURNING id INTO org_id;

  IF org_id IS NULL THEN
    SELECT id INTO org_id FROM organizations WHERE slug = 'meshed-dev-org' LIMIT 1;
  END IF;

  -- Team
  SELECT id INTO team_id
  FROM teams
  WHERE organization_id = org_id AND name = 'Meshed Dev Team'
  LIMIT 1;

  IF team_id IS NULL THEN
    INSERT INTO teams (name, organization_id, created_at, updated_at)
    VALUES ('Meshed Dev Team', org_id, NOW(), NOW())
    RETURNING id INTO team_id;
  END IF;

  -- Users (create if missing)
  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Alex', 'Manager', 'alex@email.com', 'user', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO manager_id FROM users WHERE email = 'alex@email.com' LIMIT 1;

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Will', 'Athlete', 'will@email.com', 'user', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO athlete_id FROM users WHERE email = 'will@email.com' LIMIT 1;

  -- Org memberships
  IF manager_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, manager_id, 'manager', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'manager', status = 'active', updated_at = NOW();
  END IF;

  IF athlete_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, athlete_id, 'user', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;

  -- Team staff (manager)
  IF manager_id IS NOT NULL THEN
    INSERT INTO team_staff (
      user_id, team_id, role, status, created_at, updated_at
    )
    VALUES (manager_id, team_id, 'manager', 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'manager', status = 'active', updated_at = NOW();
  END IF;

  -- Team roster (athletes)
  IF athlete_id IS NOT NULL THEN
    INSERT INTO user_teams (
      user_id, team_id, role, position, status, joined_at, updated_at
    )
    VALUES (athlete_id, team_id, 'athlete', NULL, 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'athlete', status = 'active', updated_at = NOW();
  END IF;
END $$;

