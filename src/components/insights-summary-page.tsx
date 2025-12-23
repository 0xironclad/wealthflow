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
import { Eye, CheckCircle2, AlertCircle, TrendingUp, PiggyBank } from "lucide-react";

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

      {/* Savings Progress Card */}
      <Card className="relative overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Decorative gradient */}
        <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-primary/10 blur-2xl" />

        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">Savings Progress</CardDescription>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5">
              <PiggyBank className="w-3.5 h-3.5 text-primary" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <CardTitle className="text-2xl font-bold tracking-tight">{progressStatus.progress}%</CardTitle>
            <span className={`text-xs py-0.5 px-2 rounded-full font-medium ${progressStatus.status === 'Behind' ? 'bg-destructive/20 text-destructive' : 'bg-primary/20 text-primary'
              }`}>
              {progressStatus.status}
            </span>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="text-xs text-muted-foreground">
            {progressStatus.text}
          </div>
        </CardContent>
      </Card>

      {/* Budget Health Card */}
      <Card className="relative overflow-hidden border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Decorative gradient */}
        <div className="absolute -bottom-12 -left-12 w-24 h-24 rounded-full bg-chart-2/10 blur-2xl" />

        <CardHeader className="pb-2 relative z-10">
          <div className="flex items-center justify-between">
            <CardDescription className="text-xs">Budget Health</CardDescription>
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-chart-2/20 to-chart-2/5">
              <TrendingUp className="w-3.5 h-3.5 text-chart-2" />
            </div>
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {budgetHealthPropData.budgetProgress}%
            </CardTitle>
            <TooltipProvider>
              <Tooltip delayDuration={200}>
                <TooltipTrigger asChild>
                  <Badge
                    variant="outline"
                    className="cursor-help gap-1 text-xs py-0.5 px-2 transition-colors bg-secondary/50 hover:bg-secondary/80 border-border/50"
                  >
                    <Eye className="w-3 h-3" />
                    Glance
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
                            <AlertCircle className="w-3 h-3 text-chart-4 flex-shrink-0" />
                            <span className="text-muted-foreground">{budget}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-primary" />
                        <span>Everything looks great!</span>
                      </div>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="relative z-10">
          <div className="flex items-center gap-2">
            {budgetHealthPropData.budgetsOverSpentCount > 0 ? (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-chart-4 animate-pulse" />
                <span className="text-xs font-medium text-chart-4">
                  {budgetHealthPropData.budgetsOverSpentCount} {budgetHealthPropData.budgetsOverSpentCount === 1 ? 'budget' : 'budgets'} over
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-xs font-medium text-primary">
                  All budgets on track
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
