import type { Role } from "../../src/types/index";

export const mockDbEvent = {
    id: '1',
    team_id: 'team-1',
    team_facility_id: 'facility-1',
    name: 'Practice',
    type: 'Practice',
    start_time: '09:00',
    end_time: '11:00',
    start_date: new Date('2026-03-12'),
    end_date: new Date('2026-03-12'),
    reoccurring: false,
    reoccurr_type: undefined,
    day_of_week: 'Thursday',
    status: 'approved',
    opponent: null,
    home_away: null,
    lift_type: null,
    notes: 'Team practice',
};

export const mockFormattedEvent = {
    id: '1',
    teamId: 'team-1',
    teamFacilityId: 'facility-1',
    name: 'Practice',
    type: 'Practice',
    startTime: '09:00',
    endTime: '11:00',
    startDate: new Date('2026-03-12'),
    endDate: new Date('2026-03-12'),
    reoccurring: false,
    selectedReoccurrType: undefined,
    dayOfWeek: 'Thursday',
    status: 'approved',
    opponent: null,
    homeAway: null,
    liftType: null,
    notes: 'Team practice',
};

export const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    role: 'admin',
    organizationId: 'org-1',
    organizationRole: 'admin' as Role,
    verified: true,
};

export const mockOrganization = {
    id: 'org-1',
    name: 'Meshed Org',
};

export const mockFacility = {
  name: 'facility-1',
  address1: '12 Windsor St',
  address2: null,
  city: 'Fredericton',
  province_state: 'NB',
  postal_code: 'E3B7G4',
  country: 'Canada',
  email: 'unitematchalign@gmail.com',
  phone: null,
  notes: null
};

export const mockCourseTime = {
    id : 'course-1',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'MATH1503',
    course_code: 'MATH1503',
    location: 'GD102',
    day_of_week: 'Monday',
    start_time: '8:00AM',
    end_time: '10:00AM',
    term: 'WINTER',
    start_date: '2026-03-25',
    end_date: '2026-04-25',
    recurring:true,
    created_at: '2026-03-25T00:00:00Z',
    updated_at: '2026-03-25T00:00:00Z',
}

export const mockCourseTimeInput = {
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'MATH1503',
    course_code: 'MATH1503',
    location: 'GD102',
    day_of_week: 'Monday',
    start_time: '8:00AM',
    end_time: '10:00AM',
    term: 'WINTER',
    start_date: '2026-03-25',
    end_date: '2026-04-25',
    recurring:true,
    created_at: '2026-03-25T00:00:00Z',
    updated_at: '2026-03-25T00:00:00Z',
}

export const mockCourseTimeInput2 = {
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'ENGG1001',
    course_code: 'ENGG1001',
    location: 'GD103',
    day_of_week: 'Tuesday',
    start_time: '8:00AM',
    end_time: '10:00AM',
    term: 'WINTER',
    start_date: '2026-03-25',
    end_date: '2026-04-25',
    recurring:true,
    created_at: '2026-03-25T00:00:00Z',
    updated_at: '2026-03-25T00:00:00Z',
}

export const mockCourseTime2 = {
    id : 'course-1',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    name: 'ENGG1001',
    course_code: 'ENGG1001',
    location: 'GD103',
    day_of_week: 'Tuesday',
    start_time: '8:00AM',
    end_time: '10:00AM',
    term: 'WINTER',
    start_date: '2026-03-25',
    end_date: '2026-04-25',
    recurring:true,
    created_at: '2026-03-25T00:00:00Z',
    updated_at: '2026-03-25T00:00:00Z',
}

export const mockTeam = {
    name: 'Team1',
    sport_id: '550e8400-e29b-41d4-a716-446655440000',
    season: '2026',
    league_id: 'AUS',
    gender:'CoEd'
}