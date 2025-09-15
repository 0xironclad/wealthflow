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
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { HistoryChart } from "@/components/savings/history-chart";

function Goals() {
  return (
    <div className="h-screen w-full flex flex-col ">
      <div className="flex justify-between items-center px-8 py-4 bg-background sticky top-0 z-10">
        <h1 className="text-3xl font-bold">Savings</h1>
        <SavingsCommandMenu />
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">+ New Saving</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogPrimitive.Title asChild>
              <VisuallyHidden>
                New Saving
              </VisuallyHidden>
            </DialogPrimitive.Title>
            <DialogHeader>
              <DialogTitle>Add a New Saving</DialogTitle>
            </DialogHeader>
            <SavingForm />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 px-8 overflow-y-auto styled-scrollbar">
        <div className="grid grid-cols-12 gap-2 py-2 pb-16">
          <div className="col-span-4 h-64">
            <FinancialGoalSummary />
          </div>

          <div className="col-span-4 h-64">
            <GoalProgress />
          </div>

          <div className="col-span-4 row-span-2 h-34">
            <AIInsights />
          </div>

          <div className="col-span-8 h-72">
            <SavingAccounts />
          </div>

          <div className="col-span-12">
            <HistoryChart />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Goals;
