import type { OrganizationMemberApi, OrganizationRow } from "../types/index";

function toRoleLabel(role: OrganizationMemberApi["role"]): OrganizationRow["role"] {
    switch (role) {
        case "admin":
            return "Admin";
        case "manager":
            return "Manager";
        case "user":
            return "User";
        default:
            return "User";
    }
}

function toStatusLabel(status: OrganizationMemberApi["status"]): OrganizationRow["status"] {
    return status === "active" ? "Active" : "Inactive";
}

export function mapOrganizationMemberToRow(member: OrganizationMemberApi): OrganizationRow {
    return {
        id: member.membership_id,
        userId: member.user_id,
        name: `${member.first_name} ${member.last_name || ""}`.trim(),
        email: member.email,
        role: toRoleLabel(member.role),
        status: toStatusLabel(member.status),
        createdAt: member.created_at,
    };
}