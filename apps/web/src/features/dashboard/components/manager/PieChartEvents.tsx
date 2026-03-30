import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/shared/components/ui/chart";

type EventStatusDonutProps = {
    approved: number;
    pending: number;
    denied: number;
};

const chartConfig = {
    count: {
        label: "Events",
    },
    approved: {
        label: "Approved",
        color: "var(--chart-1)",
    },
    pending: {
        label: "Pending",
        color: "var(--chart-3)",
    },
    denied: {
        label: "Denied",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;

export function EventStatusDonut({
    approved,
    pending,
    denied,
}: EventStatusDonutProps) {
    const chartData = React.useMemo(
        () => [
            {
                status: "approved",
                count: approved,
                fill: "var(--color-approved)",
            },
            {
                status: "pending",
                count: pending,
                fill: "var(--color-pending)",
            },
            {
                status: "denied",
                count: denied,
                fill: "var(--color-denied)",
            },
        ],
        [approved, pending, denied],
    );

    const totalEvents = React.useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    return (
        <Card className="h-[320px] flex flex-col">
            <CardHeader className="items-center pb-2">
                <CardTitle>Team Event Status</CardTitle>
                <CardDescription>
                    Approved, pending, and denied events
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center pb-4">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[220px] w-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="status"
                            innerRadius={60}
                            outerRadius={85}
                            strokeWidth={4}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalEvents}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 22}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Total
                                                </tspan>
                                            </text>
                                        );
                                    }

                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}