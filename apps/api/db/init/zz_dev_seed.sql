-- ---------------------------------------------------------------------------
-- DEV SEED (idempotent)
-- Creates a dev org + team and links a manager + roster users for UI testing.
-- NOTE: Docker's Postgres init scripts only run on a fresh database volume.
-- ---------------------------------------------------------------------------

-- Required for crypt()/gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  org_id UUID;
  v_team_id UUID;
  manager_id UUID;
  athlete_id UUID;
  v_user_id UUID;
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
  SELECT id INTO v_team_id
  FROM teams
  WHERE organization_id = org_id AND name = 'Meshed Dev Team'
  LIMIT 1;

  IF v_team_id IS NULL THEN
    INSERT INTO teams (name, organization_id, created_at, updated_at)
    VALUES ('Meshed Dev Team', org_id, NOW(), NOW())
    RETURNING id INTO v_team_id;
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

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Uma', 'User', 'user@email.com', 'user', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO v_user_id FROM users WHERE email = 'user@email.com' LIMIT 1;

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

  IF v_user_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, v_user_id, 'user', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO NOTHING;
  END IF;

  -- Team staff (manager)
  IF manager_id IS NOT NULL THEN
    INSERT INTO team_staff (
      user_id, team_id, role, status, created_at, updated_at
    )
    VALUES (manager_id, v_team_id, 'manager', 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'manager', status = 'active', updated_at = NOW();
  END IF;

  -- Team roster (athletes)
  IF athlete_id IS NOT NULL THEN
    INSERT INTO user_teams (
      user_id, team_id, role, position, status, joined_at, updated_at
    )
    VALUES (athlete_id, v_team_id, 'athlete', NULL, 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'athlete', status = 'active', updated_at = NOW();
  END IF;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO user_teams (
      user_id, team_id, role, position, status, joined_at, updated_at
    )
    VALUES (v_user_id, v_team_id, 'athlete', NULL, 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'athlete', status = 'active', updated_at = NOW();
  END IF;
END $$;
