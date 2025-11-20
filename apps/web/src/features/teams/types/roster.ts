export interface Athlete {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: "athlete";
  position: string | null;
  status: "active" | "pending" | "injured" | "inactive" | string;
  joined_at: string;
}
