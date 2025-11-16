export interface StaffMember {
  id: string;
  user_id: string;
  team_id?: string;
  role: string;
  status: string;
  notes: string | null;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface Invite {
  id: string;
  team_id: string;
  email: string;
  token: string;
  role: string;
  position: string | null;
  status: string;
  sent_at: string;
  accepted_at: string | null;
}
