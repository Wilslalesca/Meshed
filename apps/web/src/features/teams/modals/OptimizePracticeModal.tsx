import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useAuth } from "@/shared/hooks/useAuth";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components//ui/dropdown-menu";
import { Label } from "@/shared/components//ui/label";
import { generateIntervalOptions } from "@/features/dashboard/utils/generateIntervalOptions";
import { apiOptimizeSchedule } from "@/features/teams/api/optimize";
import type { OptimizationRequestPayload } from "@/features/teams/types/OptimizationRequest";
import type { OptimizationResult } from "@/features/teams/types/OptimizationResult";

export const OptimizePracticeModal = ({ open, onOpenChange, teamId, onOptimizationComplete }: { open: boolean; onOpenChange: (open: boolean) => void; teamId: string; onOptimizationComplete: (result: OptimizationResult) => void }) => {
    const { token } = useAuth();
    const [OptimizationType, setOptimizationType] = useState(
        "The highest attendance at each practice",
    );
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [practiceChoices, setPracticeChoices] = useState<
        Record<string, string>
    >({});

    const PRACTICE_OPTIONS = {
        SPECIFIC_TIMES: "specific",
        INTERVAL: "interval",
    } as const;

    type TimeOption = {
        startTime: string;
        endTime: string;
    };

    const [specificTimes, setSpecificTimes] = useState<
        Record<string, TimeOption[]>
    >({});

    const [intervalsInput, setIntervalsInput] = useState<
        Record<
            string,
            { startTime: string; endTime: string; durationMinutes: number }
        >
    >({});

    //----------------Helpers-------------------
    const setPracticeChoiceForDay = (day: string, value: string) => {
        setPracticeChoices((prev) => ({
            ...prev,
            [day]: value,
        }));
        if (value === PRACTICE_OPTIONS.SPECIFIC_TIMES) {
            setSpecificTimes((prev) => ({
                ...prev,
                [day]: prev[day] || [{ startTime: "", endTime: "" }],
            }));
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
        );
    };

    const addTimeOption = (day: string) => {
        setSpecificTimes((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { startTime: "", endTime: "" }],
        }));
    };

    const updateSpecificTime = (
        day: string,
        index: number,
        field: "startTime" | "endTime",
        value: string,
    ) => {
        setSpecificTimes((prev) => ({
            ...prev,
            [day]: (prev[day] ?? []).map((opt, i) =>
                i === index ? { ...opt, [field]: value } : opt,
            ),
        }));
    };

    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const submitOptimization = async () => {
        const payload: OptimizationRequestPayload = {
            optimizationType:
                OptimizationType === "The highest attendance at each practice"
                    ? "MAX_ATTENDANCE"
                    : "MIN_MISSES",
            days: selectedDays.map((day) => {
                if (practiceChoices[day] === PRACTICE_OPTIONS.SPECIFIC_TIMES) {
                    return {
                        day,
                        options: (specificTimes[day] || []).map((option) => ({
                            start: option.startTime,
                            end: option.endTime,
                        })),
                    };
                } else if (practiceChoices[day] === PRACTICE_OPTIONS.INTERVAL) {
                    const intervalInput = intervalsInput[day];

                    //check if proper error handling
                    if (!intervalInput) {
                        return { day, options: [] };
                    }

                    return {
                        day,
                        options: generateIntervalOptions(
                            intervalInput.startTime,
                            intervalInput.endTime,
                            intervalInput.durationMinutes,
                        ),
                    };
                }
                return { day, options: [] };
            }),
        };
        if (!token || !teamId) return;
        // @ISLA = here is the results of the optimize
        const result = await apiOptimizeSchedule(teamId, payload, token) as OptimizationResult;
        console.log("Optimization payload:", payload);
        console.log("Optimization result:", result);

        onOpenChange(false);
        onOptimizationComplete(result)
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Optimize Practice Schedule</DialogTitle>
                </DialogHeader>

                {/* Optimization Type */}
                <div className="grid gap-3 py-2">
                    <Label>I would like my practices to prioritise:</Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {OptimizationType}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                            <DropdownMenuLabel>
                                Which Optimization Algorithm?
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup
                                value={OptimizationType}
                                onValueChange={setOptimizationType}
                            >
                                <DropdownMenuRadioItem value="The highest attendance at each practice">
                                    The highest attendance at each practice
                                </DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="Minimizing the amount of practices each athlete misses">
                                    Minimizing the amount of practices each
                                    athlete misses
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Day Selection */}
                <div className="flex flex-wrap gap-4">
                    {days.map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                                id={day}
                                checked={selectedDays.includes(day)}
                                onCheckedChange={() => toggleDay(day)}
                            />
                            <Label htmlFor={day}>{day}</Label>
                        </div>
                    ))}
                </div>

                {/* Day Details */}
                {selectedDays.map((day) => (
                    <div
                        key={day}
                        className="mt-4 rounded-md border p-4 space-y-2"
                    >
                        <h3 className="font-semibold">
                            {day} Practice Details
                        </h3>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">
                                    {practiceChoices[day] ===
                                        PRACTICE_OPTIONS.SPECIFIC_TIMES &&
                                        "Specific times"}
                                    {practiceChoices[day] ===
                                        PRACTICE_OPTIONS.INTERVAL &&
                                        "Time interval"}
                                    {!practiceChoices[day] &&
                                        "Select practice option"}
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuRadioGroup
                                    value={practiceChoices[day]}
                                    onValueChange={(value) =>
                                        setPracticeChoiceForDay(day, value)
                                    }
                                >
                                    <DropdownMenuRadioItem
                                        value={PRACTICE_OPTIONS.SPECIFIC_TIMES}
                                    >
                                        Select specific practice time options
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem
                                        value={PRACTICE_OPTIONS.INTERVAL}
                                    >
                                        Generate options from a time interval
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Interval */}
                        {practiceChoices[day] === PRACTICE_OPTIONS.INTERVAL && (
                            <div className="grid gap-2">
                                <Input
                                    type="time"
                                    value={intervalsInput[day]?.startTime ?? ""}
                                    placeholder="Start time"
                                    onChange={(e) =>
                                        setIntervalsInput((prev) => ({
                                            ...prev,
                                            [day]: {
                                                ...prev[day],
                                                startTime: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                <Input
                                    type="time"
                                    value={intervalsInput[day]?.endTime ?? ""}
                                    placeholder="End time"
                                    onChange={(e) =>
                                        setIntervalsInput((prev) => ({
                                            ...prev,
                                            [day]: {
                                                ...prev[day],
                                                endTime: e.target.value,
                                            },
                                        }))
                                    }
                                />
                                <Input
                                    type="number"
                                    placeholder="Duration (minutes)"
                                    onChange={(e) =>
                                        setIntervalsInput((prev) => ({
                                            ...prev,
                                            [day]: {
                                                ...prev[day],
                                                durationMinutes: Number(
                                                    e.target.value,
                                                ),
                                            },
                                        }))
                                    }
                                />
                            </div>
                        )}

                        {/* Specific Times */}
                        {practiceChoices[day] ===
                            PRACTICE_OPTIONS.SPECIFIC_TIMES && (
                            <div className="space-y-3">
                                {(specificTimes[day] || []).map(
                                    (option, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Input
                                                type="time"
                                                value={option.startTime}
                                                onChange={(e) =>
                                                    updateSpecificTime(
                                                        day,
                                                        index,
                                                        "startTime",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <span>to</span>
                                            <Input
                                                type="time"
                                                value={option.endTime}
                                                onChange={(e) =>
                                                    updateSpecificTime(
                                                        day,
                                                        index,
                                                        "endTime",
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    ),
                                )}

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => addTimeOption(day)}
                                >
                                    + Add another practice option
                                </Button>
                            </div>
                        )}
                    </div>
                ))}

                <DialogFooter>
                    <Button onClick={submitOptimization}>
                        Create My Schedule
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
