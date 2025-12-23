import React from "react";
import FinancialGoalSummary from "@/components/financial-goal-summary";
import GoalProgress from "@/components/goal-progress";
import SavingAccounts from "@/components/ui/savings-accounts";
import { SavingsCommandMenu } from "@/components/savings-command-menu";
import { Button } from "@/components/ui/button";
import AIInsights from "@/components/ai-insights";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SavingForm from "@/components/savings/saving-form";
import { HistoryChart } from "@/components/savings/history-chart";
import { Plus } from "lucide-react";

function Goals() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-center px-4 py-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
        <h1 className="text-3xl font-bold">Savings</h1>
        <div className="flex items-center gap-3">
          <SavingsCommandMenu />
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default" className="gap-2">
                <Plus className="w-4 h-4" />
                New Saving
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add a New Saving</DialogTitle>
              </DialogHeader>
              <SavingForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="flex-1 px-4 overflow-y-auto styled-scrollbar pb-4">
        <div className="flex flex-col gap-3">
          {/* Top two rows - use flex for proper alignment */}
          <div className="flex flex-col lg:flex-row gap-3 lg:h-[520px]">
            {/* Left side - Summary + Savings stacked */}
            <div className="flex flex-col gap-3 lg:flex-[2] h-full">
              {/* First row - Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-[210px] flex-shrink-0">
                <FinancialGoalSummary />
                <GoalProgress />
              </div>
              {/* Second row - Savings accounts - fills remaining height */}
              <div className="flex-1 min-h-[280px]">
                <SavingAccounts />
              </div>
            </div>
            {/* Right side - AI Insights (matches combined height of left side) */}
            <div className="lg:flex-1 h-[400px] lg:h-full">
              <AIInsights />
            </div>
          </div>

          {/* Third row - History chart */}
          <div>
            <HistoryChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;
