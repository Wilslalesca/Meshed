import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/shared/components/ui/table";
import type { Athlete } from "../types/roster";

interface Props {
  roster: Athlete[];
}

export const RosterTableView = ({ roster }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Position</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {roster.map((a) => (
          <TableRow key={a.id}>
            <TableCell>{a.first_name} {a.last_name}</TableCell>
            <TableCell>{a.email}</TableCell>
            <TableCell>{a.position ?? "—"}</TableCell>
            <TableCell>{a.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
