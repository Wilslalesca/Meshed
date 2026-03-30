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
    ChartLegend,
    ChartLegendContent,
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
        color: "#45906e",
    },
    pending: {
        label: "Pending",
        color: "#D3D3D3",
    },
    denied: {
        label: "Denied",
        color: "#C91B00",
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
                fill: "#45906e",
            },
            {
                status: "pending",
                count: pending,
                fill: "#D3D3D3",
            },
            {
                status: "denied",
                count: denied,
                fill: "#C91B00",
            },
        ],
        [approved, pending, denied],
    );

    const totalEvents = React.useMemo(() => {
        return chartData.reduce((sum, item) => sum + item.count, 0);
    }, [chartData]);

    return (
        <Card className="h-[320px] flex flex-col">
            <CardHeader className="items-center">
                <CardTitle>All Team Events</CardTitle>
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
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalEvents}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 16}
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

                        <ChartLegend
                            content={<ChartLegendContent nameKey="status" />}
                            className="mt-2 flex-wrap gap-2 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
