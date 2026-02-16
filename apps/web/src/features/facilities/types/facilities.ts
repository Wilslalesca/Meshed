export type NewFacility = {
  name: string;
  address1?: string;
  address2?: string;
  city?: string;
  province_state?: string;
  postal_code?: string;
  country?: string;
  email?: string;
  phone?: string;
  notes?: string;
};

export type Facility = {
  id: string;
  name: string;
  city: string | null;
  province_state: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
};