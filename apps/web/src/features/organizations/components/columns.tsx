import type { ColumnDef } from "@tanstack/react-table";
import { Wrench } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { toast } from "sonner";
import type { OrganizationRow } from "../types/index";

type ColumnActions = {
  onPromoteToAdmin?: (row: OrganizationRow) => void;
  onMakeManager?: (row: OrganizationRow) => void;
  onMakeUser?: (row: OrganizationRow) => void;
  onDeactivate?: (row: OrganizationRow) => void;
  onActivate?: (row: OrganizationRow) => void;
};
export function getColumns(actions: ColumnActions): ColumnDef<OrganizationRow>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;
        return role === "Admin" ? (
          <Badge variant="default" className="bg-[#459da8]">{role}</Badge>
        ) : role === "Manager" ? (
          <Badge variant="default" className="bg-[#479572]">{role}</Badge>
        ) : (
          <Badge variant="outline">{role}</Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
         return status === "Active" ? (
          <Badge variant="default" >{status}</Badge>
        ) : (
          <Badge variant="secondary" >{status}</Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString();
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const member = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Wrench className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={async () => {
                  await navigator.clipboard.writeText(member.userId);
                  toast.success("User ID copied");
                }}
              >
                Copy User ID
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => actions.onPromoteToAdmin?.(member)}>Make Admin</DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onMakeManager?.(member)}>Make Manager</DropdownMenuItem>
              <DropdownMenuItem onClick={() => actions.onMakeUser?.(member)}>Make User</DropdownMenuItem>
              <DropdownMenuSeparator />

              {member.status === "Active" ? (
                <DropdownMenuItem onClick={() => actions.onDeactivate?.(member)}>Deactivate</DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => actions.onActivate?.(member)}>Activate</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}