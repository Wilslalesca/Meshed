import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import type {
    NameType,
    ValueType,
} from "recharts/types/component/DefaultTooltipContent";
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

const chartConfig = {
    hours: {
        label: "",
        color: "#81b9b2",
    },
} satisfies ChartConfig;
import { formatHoursToReadable, toNumber } from "../../utils/time";

type WeekHoursChartProps = {
    data: {
        day: string;
        hours: number;
    }[];
};



export function WeekHoursChart({ data }: WeekHoursChartProps) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Your Week</CardTitle>
                <CardDescription>Scheduled hours by day</CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={chartConfig}
                    className="h-[250px] w-full"
                >
                    <BarChart
                        accessibilityLayer
                        data={data}
                        margin={{ top: 40, left: 0, right: 0 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />

                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={(
                                        value: ValueType | undefined,
                                        _name: NameType | undefined,
                                    ) => {
                                        const numericValue = toNumber(value);
                                        return numericValue === null
                                            ? ["—", ""]
                                            : [formatHoursToReadable(numericValue), ""];
                                    }}
                                />
                            }
                        />

                        <Bar
                            dataKey="hours"
                            fill="var(--color-hours)"
                            radius={8}
                        >
                            <LabelList
                                dataKey="hours"
                                position="top"
                                offset={6}
                                className="fill-foreground"
                                fontSize={10}
                                formatter={(value: unknown) => {
                                    const numericValue = toNumber(value);
                                    return numericValue === null
                                        ? ""
                                        : formatHoursToReadable(numericValue);
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
