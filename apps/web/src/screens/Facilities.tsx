// apps/web/src/screens/Facilities.tsx (or wherever it lives)
import React, { useEffect, useState } from "react";
import { useAuth } from "@/shared/hooks/useAuth";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

type NewFacility = {
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

type Facility = {
  id: string;
  name: string;
  city: string | null;
  province_state: string | null;
  country: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
};

const provinces = [
  "Alberta",
  "British Columbia",
  "Manitoba",
  "New Brunswick",
  "Newfoundland and Labrador",
  "Nova Scotia",
  "Ontario",
  "Prince Edward Island",
  "Quebec",
  "Saskatchewan",
  "Northwest Territories",
  "Nunavut",
  "Yukon",
];

export const Facilities: React.FC = () => {
  const { token, hasRole } = useAuth();
  const canManage = hasRole?.(["admin", "manager"]) ?? false;

  const [form, setForm] = useState<NewFacility>({
    name: "",
    country: "Canada",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  // --- API helper with Authorization header ---
  const api = (path: string, init: RequestInit = {}) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const headers: any = {
      ...(init.headers || {}),
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return fetch(`http://localhost:4000${path}`, {
      credentials: "include",
      ...init,
      headers,
    });
  };

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  // --- Load facilities list ---
  const loadFacilities = async () => {
    setLoadingList(true);
    setListError(null);

    try {
      const res = await api("/facilities", { method: "GET" });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to load facilities");
      }

      const data: Facility[] = await res.json();
      setFacilities(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      if (err instanceof Error) setListError(err.message);
      else setListError("Failed to load facilities");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    if (token && canManage) {
      void loadFacilities();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, canManage]);

  // --- Create facility ---
  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) {
      setMessage("Only admins or managers can create facilities.");
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await api("/facilities", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create facility");
      }

      const created = await res.json();
      setMessage(`Created facility: ${created.name}`);
      setForm({ name: "", country: "Canada" });

      // refresh list (or push into state)
      setFacilities((prev) => [created, ...prev]);
    } catch (err: unknown) {
      if (err instanceof Error) setMessage(err.message);
      else setMessage("Error creating facility");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Facilities</h1>

      {/* Create facility card */}
      <div className="card p-4">
        <h2 className="font-semibold mb-3">Create facility</h2>
        {!canManage && (
          <p className="text-sm text-red-600 mb-2">
            Only admins or managers can create facilities.
          </p>
        )}
        <form
          onSubmit={create}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={form.email || ""}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={form.phone || ""}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="address1">Address 1</Label>
            <Input
              id="address1"
              name="address1"
              value={form.address1 || ""}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="address2">Address 2</Label>
            <Input
              id="address2"
              name="address2"
              value={form.address2 || ""}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={form.city || ""}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="province_state">Province / Territory</Label>
            <select
              id="province_state"
              name="province_state"
              value={form.province_state || ""}
              onChange={onChange}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
            >
              <option value="">Select province/territory</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input
              id="postal_code"
              name="postal_code"
              value={form.postal_code || ""}
              onChange={onChange}
            />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={form.country || ""}
              onChange={onChange}
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes || ""}
              onChange={onChange}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={!canManage || saving}>
              {saving ? "Saving..." : "Create"}
            </Button>
          </div>
        </form>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>

      {/* Facilities list */}
      <div className="card p-4">
        <h2 className="font-semibold mb-3">Existing facilities</h2>

        {loadingList && <p className="text-sm">Loading facilities…</p>}
        {listError && <p className="text-sm text-red-600">{listError}</p>}

        {!loadingList && !listError && facilities.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No facilities have been created yet.
          </p>
        )}

        {!loadingList && facilities.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 pr-3">Name</th>
                  <th className="text-left py-2 pr-3">City</th>
                  <th className="text-left py-2 pr-3">Province</th>
                  <th className="text-left py-2 pr-3">Country</th>
                  <th className="text-left py-2 pr-3">Phone</th>
                  <th className="text-left py-2 pr-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => (
                  <tr key={f.id} className="border-b last:border-0">
                    <td className="py-2 pr-3">{f.name}</td>
                    <td className="py-2 pr-3">{f.city || "-"}</td>
                    <td className="py-2 pr-3">{f.province_state || "-"}</td>
                    <td className="py-2 pr-3">{f.country || "-"}</td>
                    <td className="py-2 pr-3">{f.phone || "-"}</td>
                    <td className="py-2 pr-3">{f.email || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
