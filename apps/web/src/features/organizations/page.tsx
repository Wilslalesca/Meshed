
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/shared/components/ui/select";
import { DataTable } from "@/shared/components/data-table";

import { Filter, Search, Plus } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/shared/hooks/useAuth";
import {
  apiAddOrganizationMember,
  apiGetOrganizationMembers,
  apiUpdateOrganizationMemberRole,
  apiUpdateOrganizationMemberStatus,
} from "./api/index";
import type {
    UpdateOrganizationMemberRolePayload,
    UpdateOrganizationMemberStatusPayload,
    OrganizationRow
} from "./types";
import { mapOrganizationMemberToRow } from "./utils/index";
import { getColumns } from "./components/columns";
import { AddMemberDialog } from "./components/AddMemberDialog";
import type { Role } from "../auth/types/auth";

export default function OrganizationPage() {
    const { token } = useAuth();
    const [members, setMembers] = useState<OrganizationRow[]>([]);
    const [loading, setLoading] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [sortOption, setSortOption] = useState("newest");
    const [roleFilter, setRoleFilter] = useState("all");
    const [addOpen, setAddOpen] = useState(false);

    const loadMembers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const data = await apiGetOrganizationMembers(token);
            setMembers(data.map(mapOrganizationMemberToRow));
        } 
        catch (error) {
            console.error("Error loading members:", error);
            toast.error("Failed to load members");
        } 
        finally {
            setLoading(false);
        }
    }, [token]);
    
    useEffect(() => {
        void loadMembers();
    }, [loadMembers]);

    const filteredMembers = useMemo(() => {
        let filtered = [...members];

        if (searchQuery) {
            filtered = filtered.filter(
                (member) =>
                    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.email.toLowerCase().includes(searchQuery.toLowerCase()),
            );
        }

        if (roleFilter !== "all") {
            filtered = filtered.filter(
                (member) => member.role.toLowerCase() === roleFilter.toLowerCase(),
            );
        }

        filtered.sort((a, b) => {
            switch (sortOption) {
                case "newest":
                    return (new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                case "oldest":
                    return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                case "alphabetical":
                    return a.name.localeCompare(b.name);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [searchQuery, sortOption, roleFilter, members]);

    const handleRoleUpdate = useCallback(async (row: OrganizationRow, newRole: UpdateOrganizationMemberRolePayload) => {
        if (!token) return;
        try {
            await apiUpdateOrganizationMemberRole(token, row.id, newRole);
            toast.success("Role updated successfully");
            await loadMembers();
        }
        catch (error) {
            console.error("Error updating role:", error);
            toast.error("Failed to update role");
        }
    }, [token, loadMembers]);

    const handleStatusUpdate = useCallback(async (row: OrganizationRow, newStatus: UpdateOrganizationMemberStatusPayload) => {
        if (!token) return;
        try {
            await apiUpdateOrganizationMemberStatus(token, row.id, newStatus);
            toast.success("Status updated successfully");
            await loadMembers();
        }
        catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    }, [token, loadMembers]);


    const handleAddMember = useCallback(async (member: { email: string; role: Role }) => {
        if (!token) return;
        await apiAddOrganizationMember(token, member);
        toast.success("Member added successfully");
        await loadMembers();
    }, [token, loadMembers]);

    const columns = useMemo(() =>
        getColumns({
            onPromoteToAdmin: (row) => void handleRoleUpdate(row, { role: "admin" }),
            onMakeManager: (row) => void handleRoleUpdate(row, { role: "manager" }),
            onMakeUser: (row) => void handleRoleUpdate(row, { role: "user" }),
            onDeactivate: (row) => void handleStatusUpdate(row, { status: "inactive" }),
            onActivate: (row) => void handleStatusUpdate(row, { status: "active" }),
        }),
        [handleRoleUpdate, handleStatusUpdate]
    );

    return (
        <div className="flex w-full flex-1 flex-col">
      <div className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">
                Organization Members
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your organization team members
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="default" onClick={() => setAddOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                <span>Add Member</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg bg-background pl-8 md:w-[300px]"
                />
              </div>

              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3.5 w-3.5" />
                <span>Filter</span>
              </Button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Select defaultValue="all" onValueChange={setRoleFilter}>
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="newest" onValueChange={setSortOption}>
                <SelectTrigger className="h-8 w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="alphabetical">Alphabetical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DataTable<OrganizationRow, unknown>
            data={loading ? [] : filteredMembers}
            columns={columns}
          />
        </main>
      </div>

      <AddMemberDialog
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddMember}
      />
    </div>
    );
}
