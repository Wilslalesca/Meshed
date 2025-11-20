import type { StaffMember } from "../../types/staff";
import { StaffCardView } from "../StaffCardView";
import { StaffTableView } from "../StaffTableView";

interface Props {
  staff: StaffMember[];
  onUpdated: () => void;
  onRemoved: (staffId: string) => void;
  viewMode: "cards" | "table";
}

export const TeamStaffTab = ({ staff, onRemoved, viewMode }: Props) => {
  if (staff.length === 0) {
    return <p className="text-muted-foreground">No staff added yet.</p>;
  }

  return viewMode === "cards" ? (
    <StaffCardView staff={staff} onRemove={onRemoved} />
  ) : (
    <StaffTableView staff={staff} onRemove={onRemoved} />
  );
};
