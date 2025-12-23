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

    type ChartDataEntry = {
        month: string
        [key: string]: string | number
    }

    const chartData: ChartDataEntry[] = allMonths.map(m => {
        const entry: ChartDataEntry = { month: new Date(m).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) }
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
        return (
            <Card className="h-full w-full flex items-center justify-center border-border/50 min-h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </Card>
        );
    }

    return (
        <Card className="h-full w-full relative overflow-hidden border-border/50">
            {/* Decorative gradient */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-chart-1/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-chart-5/10 blur-3xl" />

            <CardHeader className="relative z-10">
                <CardTitle className="text-sm font-semibold">Monthly Savings by Goal</CardTitle>
                <CardDescription className="text-xs">
                    Net savings per month for each goal (deposits - withdrawals)
                </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="text-xs"
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
            <CardFooter className="border-t border-border/50 relative z-10">
                <div className="flex w-full items-center justify-between text-sm">
                    <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2 font-semibold text-foreground">
                            Total: ${historyData.reduce((sum, item) => sum + (item.net || 0), 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            {chartData.length} months across {uniqueNames.length} goals
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {uniqueNames.slice(0, 4).map((name, index) => (
                            <div key={name} className="flex items-center gap-1.5">
                                <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: colors[index % colors.length] }}
                                />
                                <span className="text-xs text-muted-foreground truncate max-w-[80px]">{name}</span>
                            </div>
                        ))}
                        {uniqueNames.length > 4 && (
                            <span className="text-xs text-muted-foreground">+{uniqueNames.length - 4} more</span>
                        )}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
