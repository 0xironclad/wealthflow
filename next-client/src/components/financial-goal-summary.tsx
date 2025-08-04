"use client";
import { useQuery } from "@tanstack/react-query";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { RadialProgress } from "./radial-progress";
import { getSavings } from "@/server/saving"
import { Loader2 } from "lucide-react";
import { SavingsType } from "@/lib/types";
import { useUser } from "@/context/UserContext";

function FinancialGoalSummary() {
    const { user, isLoading: isAuthLoading } = useUser();

    const { data: savings, isLoading } = useQuery({
        queryKey: ['savings', user?.id],
        queryFn: () => user ? getSavings(user.id) : null,
        enabled: !!user,
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

    })

    if (isLoading || isAuthLoading) {
        return (
            <Card className="w-full h-full flex flex-col">
                <CardHeader className="py-3">
                    <CardTitle>Financial Goal Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[200px]">
                    <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </CardContent>
            </Card>
        );
    }

    const activeGoals = savings?.filter((saving: SavingsType) => saving.status === 'active').length;
    const completed = savings?.filter((saving: SavingsType) => saving.status === 'completed').length;
    const atRisk = savings?.filter((saving: SavingsType) => saving.status === 'atRisk').length;
    const totalGoals = activeGoals + completed + atRisk;
    const percentageComplete = totalGoals > 0 ? (completed / totalGoals) * 100 : 0;

    const goalSummary = [
        { label: 'Active Goals', value: activeGoals },
        { label: 'Completed Goals', value: completed },
        { label: 'At Risk Goals', value: atRisk },
        { label: 'On Track Goals', value: activeGoals - atRisk }
    ];
    return (
        <Card className="w-full h-full flex flex-col">
            <CardHeader className="py-3">
                <CardTitle>Financial Goal Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center flex-1 py-2">
                <div>
                    {goalSummary.map((item, index) => (
                        <div key={index} className="mb-1">
                            <p className="text-sm text-muted-foreground flex justify-between gap-2">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </p>
                        </div>
                    ))}
                </div>
                <div className="h-32 w-32 flex-shrink-0 flex items-start justify-center flex-col">
                    <RadialProgress progress={Number(percentageComplete.toFixed(1))} />
                </div>
            </CardContent>
        </Card>
    );
}

export default FinancialGoalSummary;
