"use client"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Progress as ProgressPrimitive } from "@/components/ui/progress"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Progress = ProgressPrimitive as any;
import { Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { getSavings } from "@/server/saving"
import { SavingsType } from "@/lib/types"
import { useUser } from "@/context/UserContext"


function GoalProgress() {
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: savings, isLoading } = useQuery({
        queryKey: ['savings', user?.id],
        queryFn: () => getSavings(user?.id ?? ''),
        enabled: !!user?.id,
        select: (data) => data.map((saving: {
            id: number;
            userid: number;
            name: string;
            date: string;
            amount: string;
            goal: string;
            status: string;
        }) => ({
            id: saving.id,
            userId: saving.userid,
            name: saving.name,
            date: saving.date,
            amount: parseFloat(saving.amount),
            goal: parseFloat(saving.goal),
            status: saving.status
        }))
    });

    const progresses = savings?.map((saving: SavingsType) => ({
        title: saving.name,
        value: saving.goal ? (saving.amount / saving.goal * 100) : 0
    }));

    if (isLoading || isAuthLoading) {
        return (
            <Card className="w-full h-full flex flex-col border-border/50">
                <CardHeader className="py-3">
                    <CardTitle className="text-sm font-semibold">Saving Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center flex-1">
                    <Loader2 className="animate-spin rounded-full h-8 w-8 text-primary" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full flex flex-col relative overflow-hidden border-border/50">
            {/* Decorative gradient */}
            <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-chart-2/10 blur-3xl" />

            <CardHeader className="py-3 flex-none relative z-10">
                <CardTitle className="text-sm font-semibold">Saving Progress</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 relative z-10">
                <div className="h-full overflow-y-auto styled-scrollbar space-y-3 pr-2">
                    {progresses?.map((item: {
                        title: string;
                        value: number;
                    }, index: number) => (
                        <div key={index} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-foreground truncate max-w-[60%]">
                                    {item.title}
                                </span>
                                <span className="text-xs font-semibold text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-full">
                                    {Number.isInteger(item.value) ? item.value : item.value.toFixed(1)}%
                                </span>
                            </div>
                            <Progress value={item.value} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default GoalProgress;
