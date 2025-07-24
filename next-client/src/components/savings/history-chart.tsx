"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { useQuery } from "@tanstack/react-query"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { useUser } from "@/context/UserContext"

interface SavingsHistory {
    name: string;
    amount: string;
    date: string;
}

const fetchSavingsHistory = async (userId: string): Promise<SavingsHistory[]> => {
    const response = await fetch(`/api/savings/history?userId=${userId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch savings history');
    }
    return response.json();
};

export function HistoryChart() {
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: historyData = [], isLoading } = useQuery({
        queryKey: ['savingsHistory', user?.id],
        queryFn: () => fetchSavingsHistory(user?.id ?? ''),
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    // Transform the data for the chart
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData = historyData.reduce((acc: any[], item) => {
        const date = new Date(item.date);
        const monthKey = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

        let existingMonth = acc.find(entry => entry.month === monthKey);
        if (!existingMonth) {
            existingMonth = {
                month: monthKey,
                ...Object.fromEntries(Array.from(new Set(historyData.map(h => h.name))).map(name => [name, 0]))
            };
            acc.push(existingMonth);
        }

        existingMonth[item.name] = (existingMonth[item.name] || 0) + parseFloat(item.amount);

        return acc;
    }, []).sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateA.getTime() - dateB.getTime();
    });

    const allGoals = Array.from(new Set(historyData.map(item => item.name)));
    chartData.forEach(monthData => {
        allGoals.forEach(goalName => {
            if (!(goalName in monthData)) {
                monthData[goalName] = 0;
            }
        });
    });

    const colors = [
        'hsl(280, 100%, 60%)',
        'hsl(340, 100%, 60%)',
        'hsl(190, 100%, 50%)',
        'hsl(40, 100%, 60%)',
        'hsl(130, 100%, 45%)',
    ];


    const uniqueNames = Array.from(new Set(historyData.map(item => item.name)));
    const chartConfig = uniqueNames.reduce((acc: ChartConfig, name, index) => {
        acc[name] = {
            label: name,
            color: colors[index % colors.length],
        };
        return acc;
    }, {});

    if (isLoading || isAuthLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Card className="h-full w-full overflow-hidden rounded-lg border bg-card shadow-sm transition-all hover:shadow-md dark:bg-card dark:text-card-foreground mb-5">
            <CardHeader>
                <CardTitle>Monthly Savings by Goal</CardTitle>
                <CardDescription>
                    Showing your savings deposits by goal and month
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeOpacity={0.2} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            stroke="hsl(var(--foreground))"
                            opacity={0.5}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        {uniqueNames.map((name, index) => (
                            <Line
                                key={name}
                                dataKey={name}
                                type="monotone"
                                stroke={colors[index % colors.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Total savings: ${historyData.reduce((sum, item) => sum + parseFloat(item.amount), 0).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {historyData.length} deposits across {chartData.length} months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
