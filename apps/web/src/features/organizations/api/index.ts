export const API_BASE = import.meta.env.VITE_API_BASE_URL;
import type {
    OrganizationMemberApi,
    UpdateOrganizationMemberRolePayload,
    UpdateOrganizationMemberStatusPayload,
    AddOrganizationMemberPayload,
} from "../types";

export async function apiGetOrganizationMembers(token: string) {
    const res = await fetch(`${API_BASE}/organization/users`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw data;
    
    return data as OrganizationMemberApi[];
}

export async function apiAddOrganizationMember(token: string, input: AddOrganizationMemberPayload) {
    const res = await fetch(`${API_BASE}/organization/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return data;
}

export async function apiUpdateOrganizationMemberRole(token: string, membershipId: string, input: UpdateOrganizationMemberRolePayload) {
    const res = await fetch(`${API_BASE}/organization/users/${membershipId}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return data;
}

export async function apiUpdateOrganizationMemberStatus(token: string, membershipId: string, input: UpdateOrganizationMemberStatusPayload) {
    const res = await fetch(`${API_BASE}/organization/users/${membershipId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        credentials: "include",
        body: JSON.stringify(input),
    });
    
    const data = await res.json();
    if (!res.ok) throw data;

    return data;
}


export async function apiRemoveOrganizationMember(token: string, membershipId: string) {
    const res = await fetch(`${API_BASE}/organization/users/${membershipId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw data;

    return data;
}