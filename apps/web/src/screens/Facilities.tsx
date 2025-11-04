import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  latitude?: string;
  longitude?: string;
  notes?: string;
};

export const Facilities: React.FC = () => {
  const { token, hasRole } = useAuth();
  const isAdmin = hasRole?.(["admin"]) ?? false;

  const [form, setForm] = useState<NewFacility>({
    name: "",
    country: "Canada",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      setMessage("Only admins can create facilities.");
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:4000/facilities", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          latitude: form.latitude ? Number(form.latitude) : undefined,
          longitude: form.longitude ? Number(form.longitude) : undefined,
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Failed to create facility");
      }

      const created = await res.json();
      setMessage(`Created facility: ${created.name}`);
      setForm({ name: "", country: "Canada" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message);
      } else if (typeof err === "string") {
        setMessage(err);
      } else {
        try {
          setMessage(JSON.stringify(err) || "Error creating facility");
        } catch {
          setMessage("Error creating facility");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">Facilities</h1>

      <div className="card p-4">
        <h2 className="font-semibold mb-3">Create facility</h2>
        {!isAdmin && <p className="text-sm text-red-600 mb-2">Only admins can create facilities.</p>}
        <form onSubmit={create} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" value={form.name} onChange={onChange} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" value={form.email || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" value={form.phone || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="address1">Address 1</Label>
            <Input id="address1" name="address1" value={form.address1 || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="address2">Address 2</Label>
            <Input id="address2" name="address2" value={form.address2 || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="city">City</Label>
            <Input id="city" name="city" value={form.city || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="province_state">Province/State</Label>
            <Input id="province_state" name="province_state" value={form.province_state || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="postal_code">Postal Code</Label>
            <Input id="postal_code" name="postal_code" value={form.postal_code || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="country">Country</Label>
            <Input id="country" name="country" value={form.country || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" name="latitude" value={form.latitude || ""} onChange={onChange} />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" name="longitude" value={form.longitude || ""} onChange={onChange} />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              value={form.notes || ""}
              onChange={onChange}
              className="w-full rounded-md border border-[--color-border] bg-[--color-background] px-3 py-2"
            />
          </div>

          <div className="md:col-span-2">
            <Button type="submit" disabled={!isAdmin || saving}>
              {saving ? "Saving..." : "Create"}
            </Button>
          </div>
        </form>

        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </div>
  );
};
