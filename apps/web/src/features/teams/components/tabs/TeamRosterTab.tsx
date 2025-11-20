import type { Athlete } from "../../types/roster";
import { RosterCardView } from "../RosterCardView";
import { RosterTableView } from "../RosterTableView";

interface Props {
  roster: Athlete[];
  onRemoveAthlete?: (id: string) => void;
  viewMode: "cards" | "table";
}

export const TeamRosterTab = ({ roster, onRemoveAthlete, viewMode }: Props) => {
  if (roster.length === 0) {
    return <p className="text-muted-foreground">No athletes added yet.</p>;
  }

  return viewMode === "cards" ? (
    <RosterCardView roster={roster} onRemoveAthlete={onRemoveAthlete} />
  ) : (
    <RosterTableView roster={roster} onRemoveAthlete={onRemoveAthlete} />
  );
};

export { TeamRosterTab as RosterTabView };
