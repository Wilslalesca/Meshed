export type OrganizationMemberApi = {
    membership_id: string;
    organization_id: string;
    user_id: string;
    role: "admin" | "manager" | "user";
    status: "active" | "inactive";
    created_at: string;
    updated_at: string;
    first_name: string;
    last_name: string | null;
    email: string;
    active: boolean;
    verified: boolean;
};


export type OrganizationRow = {
    id: string; 
    userId: string;
    name: string;
    email: string;
    role: "Admin" | "Manager" | "User";
    status: "Active" | "Inactive";
    createdAt: string;
};


export type UpdateOrganizationMemberRolePayload = {
    role: "admin" | "manager" | "user";
};

export type UpdateOrganizationMemberStatusPayload = {
    status: "active" | "inactive";
};

export type AddOrganizationMemberPayload = {
    email: string;
    role: "admin" | "manager" | "user";
};