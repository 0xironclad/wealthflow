"use client"
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { SavingsEmptyState } from "./empty-states/savings-empty-state";
import {
  Calendar,
  ArrowRight,
  CheckCircle2,
  Timer,
  AlertCircle,
  PiggyBank,
} from "lucide-react";
import { getSavings } from "@/server/saving";
import { Saving } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SavingDetails } from "../savings/saving-details";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Skeleton } from "@/components/ui/skeleton"
import React from "react";
import { useUser } from "@/context/UserContext";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const statusConfig = {
  "atRisk": {
    icon: Timer,
    class: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-900/30",
  },
  "active": {
    icon: AlertCircle,
    class: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  "completed": {
    icon: CheckCircle2,
    class: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
};

const SavingsAccountSkeleton = () => {
  return (
    <div className="w-full h-full overflow-x-auto">
      <div className="flex gap-3 min-w-full h-full">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "flex flex-col",
              "w-[280px] shrink-0",
              "bg-white dark:bg-zinc-900/70",
              "rounded-xl",
              "border border-zinc-100 dark:border-zinc-800",
              "shadow-sm backdrop-blur-xl"
            )}
          >
            <div className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <Skeleton className="w-[40px] h-[40px] rounded-lg" />
                <Skeleton className="w-[100px] h-[24px] rounded-full" />
              </div>

              <div className="space-y-2">
                <Skeleton className="w-[160px] h-[20px] rounded-full" />
                <Skeleton className="w-full h-[16px] rounded-full" />
                <Skeleton className="w-[85%] h-[16px] rounded-full" />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="w-[60px] h-[16px] rounded-full" />
                  <Skeleton className="w-[40px] h-[16px] rounded-full" />
                </div>
                <Skeleton className="w-full h-[6px] rounded-full" />
              </div>

              <div className="flex items-center gap-1.5">
                <Skeleton className="w-[80px] h-[20px] rounded-full" />
                <Skeleton className="w-[100px] h-[16px] rounded-full" />
              </div>

              <div className="flex items-center gap-1.5">
                <Skeleton className="w-[16px] h-[16px] rounded-full" />
                <Skeleton className="w-[100px] h-[16px] rounded-full" />
              </div>
            </div>

            <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
              <Skeleton className="w-full h-[38px] rounded-none rounded-b-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function SavingAccounts() {
  const { user, isLoading: isAuthLoading } = useUser();

  const { data: savings, isLoading, error } = useQuery({
    queryKey: ['savings', user?.id],
    queryFn: () => user ? getSavings(user.id) : null,
    enabled: !!user,
    select: (data) => data.map((saving: {
      id: number;
      userid: number;
      name: string;
      created_at: string;
      amount: string;
      goal: string;
      status: string;
      description: string;
    }) => ({
      id: saving.id,
      userId: saving.userid,
      name: saving.name,
      createdAt: saving.created_at,
      amount: parseFloat(saving.amount),
      goal: parseFloat(saving.goal),
      status: saving.status,
      description: saving.description
    })).sort((a: Saving, b: Saving) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  if (isLoading || isAuthLoading) {
    return <SavingsAccountSkeleton />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-48 text-red-500">
        Failed to load savings accounts
      </div>
    );
  }

  if (!savings || savings.length === 0) {
    return <SavingsEmptyState />;
  }


  return (
    <div className="w-full h-full">
      <div className="w-full h-full overflow-x-auto styled-scrollbar">
        <div className="flex gap-3 min-w-full h-full pb-2">
          {savings.map((item: Saving) => (
            <div
              key={item.id}
              className={cn(
                "flex flex-col",
                "w-[280px] shrink-0",
                "bg-white dark:bg-zinc-900/70",
                "rounded-xl",
                "border border-zinc-100 dark:border-zinc-800",
                "hover:border-zinc-200 dark:hover:border-zinc-700",
                "transition-all duration-200",
                "shadow-sm backdrop-blur-xl h-full"
              )}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                  >
                    <PiggyBank className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  </div>
                  <div
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1.5",
                      statusConfig[item.status as keyof typeof statusConfig]?.bg,
                      statusConfig[item.status as keyof typeof statusConfig]?.class
                    )}
                  >
                    {React.createElement(statusConfig[item.status as keyof typeof statusConfig]?.icon || AlertCircle, {
                      className: "w-3.5 h-3.5",
                    })}
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Progress
                    </span>
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {Math.round((item.amount / item.goal) * 100)}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.round((item.amount / item.goal) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    ${item.amount.toLocaleString()}
                  </span>
                  <span className="text-xs text-zinc-600 dark:text-zinc-400">
                    of ${item.goal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center text-xs text-zinc-600 dark:text-zinc-400">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <div className="mt-auto border-t border-zinc-100 dark:border-zinc-800">
                    <button
                      className={cn(
                        "w-full flex items-center justify-center gap-2",
                        "py-2.5 px-3",
                        "text-xs font-medium",
                        "text-zinc-600 dark:text-zinc-400",
                        "hover:text-zinc-900 dark:hover:text-zinc-100",
                        "hover:bg-zinc-100 dark:hover:bg-zinc-800/50",
                        "transition-colors duration-200"
                      )}
                    >
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </DialogTrigger>
                <DialogContent className="p-0 gap-0 sm:max-w-[760px] w-[95vw] max-h-[85vh] overflow-auto">
                  <DialogPrimitive.Title asChild>
                    <VisuallyHidden>
                      <DialogTitle>
                        View Saving Details
                      </DialogTitle>
                    </VisuallyHidden>
                  </DialogPrimitive.Title>
                  <SavingDetails savingId={item.id} />
                </DialogContent>
              </Dialog>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
