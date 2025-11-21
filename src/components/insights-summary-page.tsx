"use client";

import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { MonthlySavingsLineChart } from "./savings/monthly-savings";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle2, AlertCircle } from "lucide-react";

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

export const InsightsSummaryCards: React.FC<InsightsSummaryCardsProps> = ({ progressStatus, budgetHealthPropData }) => {


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
              {budgetHealthPropData.budgetProgress}%
            </CardTitle>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="cursor-help gap-1.5 transition-colors bg-transparent hover:bg-transparent"
                  >
                    <Eye className="w-3 h-3" />
                    Quick Glance
                  </Badge>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="end"
                  className="max-w-[240px] p-3 bg-popover"
                >
                  <div className="space-y-2">
                    <p className="text-xs font-medium mb-2 text-foreground">
                      {budgetHealthPropData.budgetsOverSpentCount > 0
                        ? 'Budgets Over Limit'
                        : 'All Budgets On Track'}
                    </p>
                    {budgetHealthPropData.budgetsOverSpentCount > 0 ? (
                      <div className="space-y-1.5">
                        {budgetHealthPropData.overspentBudgets.map((budget, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 text-xs"
                          >
                            <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            <span className="text-muted-foreground">{budget}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        <span>Everything looks great!</span>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            {budgetHealthPropData.budgetsOverSpentCount > 0 ? (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-medium text-amber-600">
                    {budgetHealthPropData.budgetsOverSpentCount} {budgetHealthPropData.budgetsOverSpentCount === 1 ? 'budget' : 'budgets'} over
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs font-medium text-green-600">
                    All budgets on track
                  </span>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
