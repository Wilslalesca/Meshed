import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components//ui/dropdown-menu";
import { useAuth } from "@/shared/hooks/useAuth";
import { Input } from "@/shared/components//ui/input";
import { Label } from "@/shared/components//ui/label";
//import { OptimizationRequest } from "@/features/dashboard/types/OptimizationRequest";
import { generateIntervalOptions } from "@/features/dashboard/utils/generateIntervalOptions";
//import { submitOptimizationRequest } from "@/features/dashboard/api/optimizationAPI";

export const OptimizePage: React.FC = () => {
    const [OptimizationType, setOptimizationType] = React.useState(
        "The highest attendance at each practice"
    );
    const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
    const [practiceChoices, setPracticeChoices] = React.useState<
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

    const [specificTimes, setSpecificTimes] = React.useState<
        Record<string, TimeOption[]>
    >({});

    const setPracticeChoiceForDay = (day: string, value: string) => {
        setPracticeChoices(prev => ({
            ...prev,
            [day]: value,
        }));
        if (value === PRACTICE_OPTIONS.SPECIFIC_TIMES) {
            setSpecificTimes(prev => ({
                ...prev,
                [day]: prev[day] || [{ startTime: "", endTime: "" }],
            }));
        }
    };

    const toggleDay = (day: string) => {
        setSelectedDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day]
        );
    };

    const addTimeOption = (day: string) => {
        setSpecificTimes(prev => ({
            ...prev,
            [day]: [...(prev[day] || []), { startTime: "", endTime: "" }],
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

    const [intervalsInput, setIntervalsInput] = React.useState<
        Record<
            string,
            { startTime: string; endTime: string; durationMinutes: number }
        >
    >({});

    const submitOptimization = async () => {
        const payload = {
            optimizationType:
                OptimizationType ===
                "The highest attendance at each practice"
                ? "MAX_ATTENDANCE"
                : "MIN_MISSES",
            days: selectedDays.map(day => {
                if(practiceChoices[day] === PRACTICE_OPTIONS.SPECIFIC_TIMES) {
                    return {
                        day,
                        options: (specificTimes[day] || []).map(option => ({
                            start: option.startTime,
                            end: option.endTime,
                        })),
                    };
                } else if(practiceChoices[day] === PRACTICE_OPTIONS.INTERVAL) {
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
                            intervalInput.durationMinutes
                        ),
                    };
                }
                return { day, options: [] };
            }),
        };
        // try{
        //     const result = await submitOptimizationRequest(payload);
        // } catch (error) {
        //     console.error("Error submitting optimization request:", error);
        // }
    };
    

    return (
        <>
            <div className="wrap">
                <h1>Optimize Schedule Page</h1>

                <div className="grid w-full items-center gap-3 py-2">
                    <Label htmlFor="OptimizationType">
                        I would like my practices to prioritise:
                    </Label>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {OptimizationType}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
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
                                    Minimizing the amount of practices each athlete misses
                                </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div className="flex flex-wrap gap-4">
                    {days.map(day => (
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
            </div>

            {selectedDays.map(day => (
                <div
                    key={day}
                    className="mt-4 rounded-md border p-4 space-y-2"
                >
                    <h3 className="font-semibold">
                        {day} Practice Details
                    </h3>

                    <div className="grid gap-2">
                        <Label htmlFor={`${day}-time`}>I want to:</Label>
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
                            <DropdownMenuContent className="w-40">
                                <DropdownMenuLabel>
                                    How to select practice options
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup
                                    value={practiceChoices[day]}
                                    onValueChange={value =>
                                        setPracticeChoiceForDay(day, value)
                                    }
                                >
                                    <DropdownMenuRadioItem
                                        value={
                                            PRACTICE_OPTIONS.SPECIFIC_TIMES
                                        }
                                    >
                                        Select specific practice time options
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem
                                        value={PRACTICE_OPTIONS.INTERVAL}
                                    >
                                        Generate options for all times in a
                                        specified interval
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {practiceChoices[day] ===
                            PRACTICE_OPTIONS.INTERVAL && (
                            <div className="grid gap-2">
                                <Label htmlFor={`${day}-start`}>
                                    Start Time
                                </Label>
                                <Input
                                    id={`${day}-start`}
                                    placeholder="e.g. 3:00 PM"
                                />

                                <Label htmlFor={`${day}-end`}>
                                    End Time
                                </Label>
                                <Input
                                    id={`${day}-end`}
                                    placeholder="e.g. 8:00 PM"
                                />

                                <Label htmlFor={`${day}-duration`}>
                                    Duration (minutes)
                                </Label>
                                <Input
                                    id={`${day}-duration`}
                                    placeholder="e.g. 90"
                                    type="number"
                                />
                            </div>
                        )}

                        {practiceChoices[day] ===
                            PRACTICE_OPTIONS.SPECIFIC_TIMES && (
                            <div className="space-y-3">
                                {(specificTimes[day] || []).map(
                                    (option, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-2"
                                        >
                                            <Input type="time" />
                                            <span>to</span>
                                            <Input type="time" />
                                        </div>
                                    )
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
                </div>
            ))}
            <div className="mt-6">
                <Button
                    type="button"
                    variant="outline"
                    onClick={submitOptimization}
                >
                    + Create My Schedule
                </Button>
            </div>
        </>
    );
};

// import { Button } from "@/shared/components/ui/button";
// import { Checkbox } from "@/shared/components/ui/checkbox";
// import React from "react";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuLabel,
//     DropdownMenuRadioGroup,
//     DropdownMenuRadioItem,
//     DropdownMenuSeparator,
//     DropdownMenuTrigger,
// } from "@/shared/components//ui/dropdown-menu";
// import { useAuth } from "@/shared/hooks/useAuth";
// import { Input } from "@/shared/components//ui/input";
// import { Label } from "@/shared/components//ui/label";

// export const OptimizePage: React.FC = () => {
//     const [OptimizationType, setOptimizationType] = React.useState("The highest attendance at each practice");
//     const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
//     const [practiceChoices, setPracticeChoices] = React.useState<Record<string, string>>({});
//     const setPracticeChoiceForDay = (day: string, value: string) => {
//         setPracticeChoices(prev => ({
//             ...prev,
//             [day]: value,
//         }));
//         if (value === PRACTICE_OPTIONS.SPECIFIC_TIMES) {
//             setSpecificTimes(prev => ({
//                 ...prev,
//                 [day]: prev[day] || [{ start: "", end: "" }],
//             }));
//         }
//     };
//     const PRACTICE_OPTIONS = {
//         SPECIFIC_TIMES:"specific",
//         INTERVAL:"interval",
//     } as const;

//     const toggleDay = (day: string) => {
//         setSelectedDays(prev =>
//             prev.includes(day)
//                 ? prev.filter(d => d !== day)
//                 : [...prev, day]
//         );
//     };
//     const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
//     type TimeOption = {
//         startTime: string;
//         endTime: string;
//     };

//     const [specificTimes, setSpecificTimes] = React.useState<Record<string, TimeOption[]>>({});
//     const addTimeOption = (day: string) => {
//         setSpecificTimes(prev=> ({
//             ...prev,
//             [day]: [...(prev[day] || []), { startTime: "", endTime: "" }],
//         }));
//     }
    
//     return (
//         <div className="wrap">
//             <h1>Optimize Schedule Page</h1>
    
//             <div className="grid w-full items-center gap-3 py-2">
//                 <Label htmlFor="OptimizationType">
//                     I would like my practices to prioritise:
//                 </Label>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline">{OptimizationType}</Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-40">
//                         <DropdownMenuLabel>
//                             Which Optimization Algorithm?
//                         </DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                             <DropdownMenuRadioGroup
//                                 value={OptimizationType}
//                                 onValueChange={setOptimizationType}
//                                 >
//                                 <DropdownMenuRadioItem value="The highest attendance at each practice">
//                                     The highest attendance at each practice
//                                 </DropdownMenuRadioItem>
//                                 <DropdownMenuRadioItem value="Minimizing the amount of practices each athlete misses">
//                                     Minimizing the amount of practices each athlete misses
//                             </DropdownMenuRadioItem>
//                             </DropdownMenuRadioGroup>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//             </div>
//            <div className="flex flex-wrap gap-4">
//                 {days.map(day => (
//                     <div key={day} className="flex items-center space-x-2">
//                         <Checkbox
//                             id={day}
//                             checked={selectedDays.includes(day)}
//                             onCheckedChange={() => toggleDay(day)}
//                         />
//                         <Label htmlFor={day}>{day}</Label>
//                     </div>
//                     ))}
//             </div>
//         </div>
 
            
//         {selectedDays.map(day => (
//             <div
//                 key={day}
//                 className="mt-4 rounded-md border p-4 space-y-2"
//             >
//             <h3 className="font-semibold">{day} Practice Details</h3>

//             <div className="grid gap-2">
//                 <Label htmlFor={`${day}-time`}>I want to:</Label>
//                 <DropdownMenu>
//                         <DropdownMenuTrigger asChild>
//                             <Button variant="outline">
//                             {practiceChoices[day] === PRACTICE_OPTIONS.SPECIFIC_TIMES &&
//                                     "Specific times"}
//                                 {practiceChoices[day] === PRACTICE_OPTIONS.INTERVAL &&
//                                     "Time interval"}
//                                 {!practiceChoices[day] && "Select practice option"}
//                             </Button>

//                         </DropdownMenuTrigger>
//                         <DropdownMenuContent className="w-40">
//                             <DropdownMenuLabel>
//                                 How to select practice options
//                             </DropdownMenuLabel>
//                             <DropdownMenuSeparator />
//                                 <DropdownMenuRadioGroup
//                                     value={practiceChoices[day]}
//                                     onValueChange={(value) => setPracticeChoiceForDay(day, value)}
//                                 >
//                                     <DropdownMenuRadioItem value={PRACTICE_OPTIONS.SPECIFIC_TIMES}>
//                                         Select specific practice time options
//                                     </DropdownMenuRadioItem>
//                                     <DropdownMenuRadioItem value={PRACTICE_OPTIONS.INTERVAL}>
//                                         Generate options for all times in a specified interval
//                                     </DropdownMenuRadioItem>
//                                 </DropdownMenuRadioGroup>
//                         </DropdownMenuContent>
//                     </DropdownMenu>

//             {practiceChoices[day] === PRACTICE_OPTIONS.INTERVAL && (
//                     <div className="grid gap-2">
//                         <Label htmlFor={`${day}-start`}>Start Time</Label>
//                         <Input
//                             id={`${day}-start`}
//                             placeholder="e.g. 3:00 PM"
//                         />

//                         <Label htmlFor={`${day}-end`}>End Time</Label>
//                         <Input
//                             id={`${day}-end`}
//                             placeholder="e.g. 8:00 PM"
//                         />

//                         <Label htmlFor={`${day}-duration`}>
//                             Duration (minutes)
//                         </Label>
//                         <Input
//                             id={`${day}-duration`}
//                             placeholder="e.g. 90"
//                             type="number"
//                         />
//                     </div>
//                 )}
//             {practiceChoices[day] === PRACTICE_OPTIONS.SPECIFIC_TIMES && (
//                 <div className="space-y-3">
//                     {(specificTimes[day] || []).map((option, index) => (
//                         <div
//                             key={index}
//                             className="flex items-center gap-2"
//                         >
//                             <Input
//                                 type="time"
//                                 value={option.start}
//                                 onChange={e =>
//                                     updateTimeOption(
//                                         day,
//                                         index,
//                                         "start",
//                                         e.target.value
//                                     )
//                                 }
//                             />

//                             <span>to</span>

//                             <Input
//                                 type="time"
//                                 value={option.end}
//                                 onChange={e =>
//                                     updateTimeOption(
//                                         day,
//                                         index,
//                                         "end",
//                                         e.target.value
//                                     )
//                                 }
//                             />
//                 </div>
//         )))}

//         <Button
//             type="button"
//             variant="outline"
//             onClick={() => addTimeOption(day)}
//         >
//             + Add another practice option
//         </Button>
//     </div>

       
// )}



