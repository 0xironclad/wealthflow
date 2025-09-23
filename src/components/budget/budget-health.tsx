"use client";

import { Progress } from "@/components/ui/progress"
import { Card, CardTitle, CardHeader, CardContent } from "../ui/card";
import { useMemo } from "react";

interface BudgetHealthProps {
  totalBudget: number;
  totalSpent: number;
}

function BudgetHealth({ totalBudget, totalSpent }: BudgetHealthProps) {
  const remainingBudget = useMemo(() => {
    return (totalBudget - totalSpent) / totalBudget * 100;
  }, [totalBudget, totalSpent]);
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle>Remaining Budget this month</CardTitle>
        <span className="text-sm text-muted-foreground">{remainingBudget}%</span>
      </CardHeader>
      <CardContent>
        <Progress value={remainingBudget} />
      </CardContent>
    </Card>
  )
}

export default BudgetHealth