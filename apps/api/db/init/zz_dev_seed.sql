-- seeding various things for testing purpose - nameing is just so this runs after db.sql

-- Required for crypt()/gen_salt()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  org_id UUID;
  v_team_id UUID;
  manager_id UUID;
  admin_id UUID;
  alex_id UUID;
  fran_id UUID;
  isla_id UUID;
  athlete_id UUID;
  v_user_id UUID;
  facility_a_id UUID;
  facility_b_id UUID;
BEGIN

  INSERT INTO organizations (name, slug, plan, active, created_at, updated_at)
  VALUES ('Meshed Dev Org', 'meshed-dev-org', 'Pro', TRUE, NOW(), NOW())
  ON CONFLICT (slug) DO UPDATE
    SET updated_at = NOW()
  RETURNING id INTO org_id;

  IF org_id IS NULL THEN
    SELECT id INTO org_id FROM organizations WHERE slug = 'meshed-dev-org' LIMIT 1;
  END IF;

  SELECT id INTO v_team_id
  FROM teams
  WHERE organization_id = org_id AND name = 'Meshed Dev Team'
  LIMIT 1;

  IF v_team_id IS NULL THEN
    INSERT INTO teams (name, organization_id, created_at, updated_at)
    VALUES ('Meshed Dev Team', org_id, NOW(), NOW())
    RETURNING id INTO v_team_id;
  END IF;

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Demo', 'Admin', 'demoadmin@email.com', 'admin', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO UPDATE
    SET role = 'admin',
        active = TRUE,
        verified = TRUE,
        updated_at = NOW();

  SELECT id INTO admin_id FROM users WHERE email = 'demoadmin@email.com' LIMIT 1;

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Demo', 'Manager', 'demomanager@email.com', 'manager', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO UPDATE
    SET role = 'manager',
        active = TRUE,
        verified = TRUE,
        updated_at = NOW();

  SELECT id INTO manager_id FROM users WHERE email = 'demomanager@email.com' LIMIT 1;

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Alex', 'Cameron', 'alex@email.com', 'user', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO alex_id FROM users WHERE email = 'alex@email.com' LIMIT 1;

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

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Fran', 'Stewart', 'fran@email.com', 'user', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO fran_id FROM users WHERE email = 'fran@email.com' LIMIT 1;

  INSERT INTO users (
    first_name, last_name, email, role, password_hash,
    active, verified, created_at, updated_at
  )
  VALUES (
    'Isla', 'Olesen', 'isla@email.com', 'user', crypt('Password123!', gen_salt('bf', 10)),
    TRUE, TRUE, NOW(), NOW()
  )
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO isla_id FROM users WHERE email = 'isla@email.com' LIMIT 1;

  -- Ensure demo admin is an org admin so they can manage facilities/events.
  IF admin_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, admin_id, 'admin', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'admin', status = 'active', updated_at = NOW();
  END IF;

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
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'user', status = 'active', updated_at = NOW();
  END IF;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, v_user_id, 'user', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'user', status = 'active', updated_at = NOW();
  END IF;

  IF alex_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, alex_id, 'user', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'user', status = 'active', updated_at = NOW();
  END IF;

  IF fran_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, fran_id, 'user', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'user', status = 'active', updated_at = NOW();
  END IF;

  IF isla_id IS NOT NULL THEN
    INSERT INTO organization_memberships (
      organization_id, user_id, role, status, created_at, updated_at
    )
    VALUES (org_id, isla_id, 'user', 'active', NOW(), NOW())
    ON CONFLICT (organization_id, user_id) DO UPDATE
      SET role = 'user', status = 'active', updated_at = NOW();
  END IF;

  IF manager_id IS NOT NULL THEN
    INSERT INTO team_staff (
      user_id, team_id, role, status, created_at, updated_at
    )
    VALUES (manager_id, v_team_id, 'manager', 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'manager', status = 'active', updated_at = NOW();
  END IF;

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

  IF alex_id IS NOT NULL THEN
    INSERT INTO user_teams (
      user_id, team_id, role, position, status, joined_at, updated_at
    )
    VALUES (alex_id, v_team_id, 'athlete', NULL, 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'athlete', status = 'active', updated_at = NOW();
  END IF;

  IF fran_id IS NOT NULL THEN
    INSERT INTO user_teams (
      user_id, team_id, role, position, status, joined_at, updated_at
    )
    VALUES (fran_id, v_team_id, 'athlete', NULL, 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'athlete', status = 'active', updated_at = NOW();
  END IF;

  IF isla_id IS NOT NULL THEN
    INSERT INTO user_teams (
      user_id, team_id, role, position, status, joined_at, updated_at
    )
    VALUES (isla_id, v_team_id, 'athlete', NULL, 'active', NOW(), NOW())
    ON CONFLICT (user_id, team_id) DO UPDATE
      SET role = 'athlete', status = 'active', updated_at = NOW();
  END IF;

  -- Facilities for facility admin dashboard (2 facilities minimum)
  SELECT id INTO facility_a_id
  FROM facilities
  WHERE organization_id = org_id AND name = 'Meshed Fieldhouse'
  LIMIT 1;

  IF facility_a_id IS NULL THEN
    INSERT INTO facilities (
      organization_id, name, address1, city, province_state, postal_code, country,
      email, phone, notes, created_at, updated_at
    )
    VALUES (
      org_id, 'Meshed Fieldhouse', '100 Demo Ave', 'Fredericton', 'NB', 'E3B 1A1', 'Canada',
      'fieldhouse@meshed.dev', '555-0100', 'Seeded demo facility (has conflicts + mixed statuses).', NOW(), NOW()
    )
    RETURNING id INTO facility_a_id;
  END IF;

  SELECT id INTO facility_b_id
  FROM facilities
  WHERE organization_id = org_id AND name = 'Meshed Training Center'
  LIMIT 1;

  IF facility_b_id IS NULL THEN
    INSERT INTO facilities (
      organization_id, name, address1, city, province_state, postal_code, country,
      email, phone, notes, created_at, updated_at
    )
    VALUES (
      org_id, 'Meshed Training Center', '200 Demo Blvd', 'Fredericton', 'NB', 'E3B 2B2', 'Canada',
      'training@meshed.dev', '555-0200', 'Seeded demo facility (no intentional conflicts).', NOW(), NOW()
    )
    RETURNING id INTO facility_b_id;
  END IF;

  -- Link team to facilities (used by some UI flows)
  IF NOT EXISTS (
    SELECT 1 FROM team_facilities
    WHERE team_id = v_team_id AND facility_id = facility_a_id
  ) THEN
    INSERT INTO team_facilities (team_id, facility_id, is_home, created_at)
    VALUES (v_team_id, facility_a_id, TRUE, NOW());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM team_facilities
    WHERE team_id = v_team_id AND facility_id = facility_b_id
  ) THEN
    INSERT INTO team_facilities (team_id, facility_id, is_home, created_at)
    VALUES (v_team_id, facility_b_id, FALSE, NOW());
  END IF;


  DELETE FROM team_events
  WHERE organization_id = org_id
    AND name IN (
      'DEMO: Fieldhouse (Approved) 10:00-11:00',
      'DEMO: Fieldhouse (Approved) 10:30-11:30 CONFLICT',
      'DEMO: Fieldhouse (Pending) 12:00-13:00',
      'DEMO: Fieldhouse (Denied) 09:00-10:00',
      'DEMO: Training (Pending) 15:00-16:00',
      'DEMO: Training (Approved) 16:30-17:30'
    );

  -- Facility A: 1 conflict + some non-conflicts; mixed statuses (pending/approved/denied)
  INSERT INTO team_events (
    team_id, team_facility_id, organization_id, requested_by_user_id,
    name, type,
    start_date, end_date, start_time, end_time,
    reoccurring, reoccurr_type, day_of_week,
    status, opponent, home_away, lift_type,
    notes, facility_notes,
    created_at, updated_at
  )
  VALUES
    (
      v_team_id, facility_a_id, org_id, manager_id,
      'DEMO: Fieldhouse (Approved) 10:00-11:00', 'Practice',
      DATE '2026-04-02', NULL, TIME '10:00', TIME '11:00',
      FALSE, NULL, NULL,
      'approved', NULL, NULL, NULL,
      'Seeded approved booking.', NULL,
      NOW(), NOW()
    ),
    (
      v_team_id, facility_a_id, org_id, manager_id,
      'DEMO: Fieldhouse (Approved) 10:30-11:30 CONFLICT', 'Lift',
      DATE '2026-04-02', NULL, TIME '10:30', TIME '11:30',
      FALSE, NULL, NULL,
      'approved', NULL, NULL, 'Strength',
      'Seeded approved booking that conflicts with the 10:00 slot.', NULL,
      NOW(), NOW()
    ),
    (
      v_team_id, facility_a_id, org_id, manager_id,
      'DEMO: Fieldhouse (Pending) 12:00-13:00', 'Practice',
      DATE '2026-04-02', NULL, TIME '12:00', TIME '13:00',
      FALSE, NULL, NULL,
      'pending', NULL, NULL, NULL,
      'Seeded pending booking (non-conflicting).', NULL,
      NOW(), NOW()
    ),
    (
      v_team_id, facility_a_id, org_id, manager_id,
      'DEMO: Fieldhouse (Denied) 09:00-10:00', 'Other',
      DATE '2026-04-03', NULL, TIME '09:00', TIME '10:00',
      FALSE, NULL, NULL,
      'denied', NULL, NULL, NULL,
      'Seeded denied booking.', 'Denied because of maintenance (seeded demo note).',
      NOW(), NOW()
    );

  -- Facility B: mixed statuses without intentional conflicts
  INSERT INTO team_events (
    team_id, team_facility_id, organization_id, requested_by_user_id,
    name, type,
    start_date, end_date, start_time, end_time,
    reoccurring, reoccurr_type, day_of_week,
    status, opponent, home_away, lift_type,
    notes, facility_notes,
    created_at, updated_at
  )
  VALUES
    (
      v_team_id, facility_b_id, org_id, manager_id,
      'DEMO: Training (Pending) 15:00-16:00', 'Practice',
      DATE '2026-04-04', NULL, TIME '15:00', TIME '16:00',
      FALSE, NULL, NULL,
      'pending', NULL, NULL, NULL,
      'Seeded pending booking.', NULL,
      NOW(), NOW()
    ),
    (
      v_team_id, facility_b_id, org_id, manager_id,
      'DEMO: Training (Approved) 16:30-17:30', 'Practice',
      DATE '2026-04-04', NULL, TIME '16:30', TIME '17:30',
      FALSE, NULL, NULL,
      'approved', NULL, NULL, NULL,
      'Seeded approved booking.', NULL,
      NOW(), NOW()
    );

  -- Individual schedules: 3–5 seeded "course_times" per user + links in user_events
  -- This powers the athlete schedule views via ScheduleModel.getAthleteSchedule.

  -- Remove previous DEMO schedule links and course_times for these users
  DELETE FROM user_events
  WHERE user_id IN (alex_id, fran_id, isla_id, athlete_id, v_user_id)
    AND class_id IN (
      SELECT id FROM course_times
      WHERE name LIKE 'DEMO:%'
        AND user_id IN (alex_id, fran_id, isla_id, athlete_id, v_user_id)
    );

  DELETE FROM course_times
  WHERE name LIKE 'DEMO:%'
    AND user_id IN (alex_id, fran_id, isla_id, athlete_id, v_user_id);

  -- Alex: 4 events
  IF alex_id IS NOT NULL THEN
    INSERT INTO course_times (
      user_id, name, course_code, location, day_of_week, start_time, end_time,
      term, start_date, end_date, recurring, created_at, updated_at
    )
    VALUES
      (alex_id, 'DEMO: BIO 101 Lecture', 'BIO101', 'Science Building 101', 'Monday', TIME '09:00', TIME '09:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (alex_id, 'DEMO: MATH 150 Tutorial', 'MATH150', 'Math Center', 'Wednesday', TIME '11:00', TIME '11:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (alex_id, 'DEMO: ENG 102 Seminar', 'ENG102', 'Humanities 210', 'Thursday', TIME '14:00', TIME '15:15', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (alex_id, 'DEMO: Study Block', 'STUDY', 'Library', 'Friday', TIME '10:00', TIME '11:30', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW());

    INSERT INTO user_events (user_id, class_id, created_at, updated_at)
    SELECT alex_id, ct.id, NOW(), NOW()
    FROM course_times ct
    WHERE ct.user_id = alex_id AND ct.name LIKE 'DEMO:%';
  END IF;

  -- Fran: 3 events
  IF fran_id IS NOT NULL THEN
    INSERT INTO course_times (
      user_id, name, course_code, location, day_of_week, start_time, end_time,
      term, start_date, end_date, recurring, created_at, updated_at
    )
    VALUES
      (fran_id, 'DEMO: CHEM 120 Lab', 'CHEM120', 'Lab Wing 3', 'Tuesday', TIME '13:00', TIME '15:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (fran_id, 'DEMO: HIST 201 Lecture', 'HIST201', 'Old Main 12', 'Monday', TIME '12:00', TIME '12:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (fran_id, 'DEMO: Office Hours', 'OFFICE', 'Student Center', 'Thursday', TIME '09:30', TIME '10:30', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW());

    INSERT INTO user_events (user_id, class_id, created_at, updated_at)
    SELECT fran_id, ct.id, NOW(), NOW()
    FROM course_times ct
    WHERE ct.user_id = fran_id AND ct.name LIKE 'DEMO:%';
  END IF;

  -- Isla: 5 events
  IF isla_id IS NOT NULL THEN
    INSERT INTO course_times (
      user_id, name, course_code, location, day_of_week, start_time, end_time,
      term, start_date, end_date, recurring, created_at, updated_at
    )
    VALUES
      (isla_id, 'DEMO: CS 210 Lecture', 'CS210', 'CompSci 110', 'Monday', TIME '10:00', TIME '11:15', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (isla_id, 'DEMO: CS 210 Lab', 'CS210L', 'CompSci Lab', 'Wednesday', TIME '15:00', TIME '16:15', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (isla_id, 'DEMO: ECON 101 Lecture', 'ECON101', 'Business 201', 'Tuesday', TIME '09:00', TIME '09:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (isla_id, 'DEMO: Project Meeting', 'PROJ', 'Engineering 2F', 'Thursday', TIME '12:30', TIME '13:15', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (isla_id, 'DEMO: Volunteer Shift', 'VOL', 'Athletics Office', 'Friday', TIME '08:30', TIME '09:30', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW());

    INSERT INTO user_events (user_id, class_id, created_at, updated_at)
    SELECT isla_id, ct.id, NOW(), NOW()
    FROM course_times ct
    WHERE ct.user_id = isla_id AND ct.name LIKE 'DEMO:%';
  END IF;

  -- Will: 3 events
  IF athlete_id IS NOT NULL THEN
    INSERT INTO course_times (
      user_id, name, course_code, location, day_of_week, start_time, end_time,
      term, start_date, end_date, recurring, created_at, updated_at
    )
    VALUES
      (athlete_id, 'DEMO: KIN 101 Lecture', 'KIN101', 'Gym Classroom', 'Tuesday', TIME '10:00', TIME '10:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (athlete_id, 'DEMO: Nutrition Seminar', 'NUTR', 'Wellness Center', 'Thursday', TIME '11:00', TIME '11:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (athlete_id, 'DEMO: Tutor Session', 'TUTOR', 'Library', 'Monday', TIME '16:00', TIME '17:00', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW());

    INSERT INTO user_events (user_id, class_id, created_at, updated_at)
    SELECT athlete_id, ct.id, NOW(), NOW()
    FROM course_times ct
    WHERE ct.user_id = athlete_id AND ct.name LIKE 'DEMO:%';
  END IF;

  -- user@email.com: 3 events
  IF v_user_id IS NOT NULL THEN
    INSERT INTO course_times (
      user_id, name, course_code, location, day_of_week, start_time, end_time,
      term, start_date, end_date, recurring, created_at, updated_at
    )
    VALUES
      (v_user_id, 'DEMO: PSY 101 Lecture', 'PSY101', 'SocialSci 10', 'Wednesday', TIME '09:00', TIME '09:50', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (v_user_id, 'DEMO: Writing Center', 'WRITE', 'Learning Commons', 'Friday', TIME '13:00', TIME '14:00', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW()),
      (v_user_id, 'DEMO: Group Study', 'GSTUDY', 'Library', 'Monday', TIME '18:00', TIME '19:00', 'Spring 2026', '2026-01-06', '2026-04-20', TRUE, NOW(), NOW());

    INSERT INTO user_events (user_id, class_id, created_at, updated_at)
    SELECT v_user_id, ct.id, NOW(), NOW()
    FROM course_times ct
    WHERE ct.user_id = v_user_id AND ct.name LIKE 'DEMO:%';
  END IF;
END $$;
