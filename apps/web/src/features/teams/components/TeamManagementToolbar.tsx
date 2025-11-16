import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import { Search, Filter, Plus } from "lucide-react";
import type { SportLookup } from "../types/teams";

interface Props {
  search: string;
  onSearchChange: (v: string) => void;

  sportFilter: string;
  onSportFilterChange: (v: string) => void;

  genderFilter: string;
  onGenderFilterChange: (v: string) => void;

  sort: string;
  onSortChange: (v: string) => void;

  sports: SportLookup[];
  onAddTeam: () => void;
}

export const TeamManagementToolbar = ({
  search,
  onSearchChange,
  sportFilter,
  onSportFilterChange,
  genderFilter,
  onGenderFilterChange,
  sort,
  onSortChange,
  sports,
  onAddTeam,
}: Props) => {
  return (
    <div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-[240px]"
          />
        </div>

        <Button variant="outline" className="gap-1 h-9">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {/* RIGHT FILTERS */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Sport */}
        <Select value={sportFilter} onValueChange={onSportFilterChange}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Sport" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sports</SelectItem>
            {sports.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.sport_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Gender */}
        <Select value={genderFilter} onValueChange={onGenderFilterChange}>
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue placeholder="Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="coed">Co-ed</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select value={sort} onValueChange={onSortChange}>
          <SelectTrigger className="h-9 w-[150px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
            <SelectItem value="alphabetical">A–Z</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onAddTeam} className="gap-1">
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </div>
    </div>
  );
};
