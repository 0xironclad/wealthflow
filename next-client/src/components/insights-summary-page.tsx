"use client";

import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { MonthlySavingsLineChart } from "./savings/monthly-savings";

interface InsightsSummaryCardsProps {
  progressStatus: {
    status: string;
    months: number;
    text: string;
    progress: number;
    netWorth?: number;
    netWorthChange?: number;
    activeGoals?: number;
    goalsOnTrack?: number;
  };
  budgetHealthPropData: {
    budgetProgress: number;
    budgetsOverSpentCount: number;
    overspentBudgets: string[];
  };
}

export const InsightsSummaryCards: React.FC<InsightsSummaryCardsProps> = ({  progressStatus, budgetHealthPropData }) => {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="sm:col-span-2">
        <MonthlySavingsLineChart />
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Savings Progress</CardDescription>
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-2xl">{progressStatus.progress}%</CardTitle>
            <span className={`text-xs py-1 px-2 rounded-full ${progressStatus.status === 'Behind' ? 'bg-red-100 text-red-600' : 'bg-primary/20 text-primary'
              }`}>
              {progressStatus.status}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {progressStatus.text}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Budget Health</CardDescription>
          <div className="flex items-baseline justify-between">
            <CardTitle className="text-2xl">
              {
                budgetHealthPropData.budgetProgress
              }%
            </CardTitle>
            <span className={`text-xs py-1 px-2 rounded-full ${budgetHealthPropData.budgetsOverSpentCount > 0
              ? 'bg-amber-500/20 text-amber-500'
              : 'bg-primary/20 text-primary'
              }`}>
              {budgetHealthPropData.budgetsOverSpentCount > 0
                ? `${budgetHealthPropData.budgetsOverSpentCount} Over`
                : 'On Track'
              }
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-muted-foreground">
            {budgetHealthPropData.budgetsOverSpentCount > 0 ? budgetHealthPropData.overspentBudgets.join(', ') : 'All budgets are on track'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
