import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";

import { TeamScheduleView } from "../../types/schedule";

export function TeamScheduleToolbar(
    { view, setView, search, setSearch } :
    { 
        view: TeamScheduleView; setView: (v: TeamScheduleView) => void;
        search: string; setSearch: (s: string) => void;
    }
) {
    console.log("view:", view);
    return ( 
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
                <Button 
                    variant={view === TeamScheduleView.Month ? "default" : "outline"}
                    onClick={() => setView(TeamScheduleView.Month)}
                >
                    Month
                </Button>
                <Button
                    variant={view === TeamScheduleView.Week ? "default" : "outline"}
                    onClick={() => setView(TeamScheduleView.Week)}
                >
                    Week
                </Button>
                <Button
                    variant={view === TeamScheduleView.Day ? "default" : "outline"}
                    onClick={() => setView(TeamScheduleView.Day)}
                >
                    Day
                </Button>
            </div>
            <div className="w-full sm:w-[320px]">
                <Input 
                    placeholder="Search by user or event"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </div>

    );
}
