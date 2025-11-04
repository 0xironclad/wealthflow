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

type MonthlyRow = {
    name: string
    month: string // 'YYYY-MM-01'
    deposits: number
    withdrawals: number
    net: number
    cumulative_balance: number
}

const fetchSavingsHistory = async (userId: string): Promise<MonthlyRow[]> => {
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

    // Build chart series for monthly net savings per goal
    const allMonths = Array.from(new Set(historyData.map(d => d.month)))
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    const goals = Array.from(new Set(historyData.map(d => d.name)))

    const byGoal = new Map<string, MonthlyRow[]>()
    historyData.forEach(row => {
        const key = row.name
        if (!byGoal.has(key)) byGoal.set(key, [])
        byGoal.get(key)!.push(row)
    })
    goals.forEach(name => byGoal.get(name)?.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime()))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chartData: any[] = allMonths.map(m => {
        const entry: any = { month: new Date(m).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) }
        goals.forEach(name => {
            const rows = byGoal.get(name) || []
            const match = rows.find(r => r.month === m)
            entry[name] = match ? match.net : 0
        })
        return entry
    })

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
                    Net savings per month for each goal (deposits - withdrawals)
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
                            Total net savings: ${historyData.reduce((sum, item) => sum + (item.net || 0), 0).toFixed(2)}
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            {chartData.length} months across {uniqueNames.length} goals
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
