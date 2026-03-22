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
    organizationRole: 'admin',
    verified: true,
};

export const mockOrganization = {
    id: 'org-1',
    name: 'Meshed Org',
};