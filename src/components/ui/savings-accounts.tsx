"use client"
import { cn } from "@/lib/utils";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { SavingsState } from "./empty-states/savings-empty-state";
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

  const { data: savings, isLoading, error, refetch, isFetched } = useQuery({
    queryKey: ['savings', user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User ID is required");
      }
      return getSavings(user.id);
    },
    enabled: !!user?.id && !isAuthLoading,
    retry: 2,
    retryDelay: 1000,
    // Match the staleTime with useSavings hook to prevent query config conflicts
    staleTime: 1000 * 60 * 60, // 1 hour - same as useSavings
    gcTime: 1000 * 60 * 60 * 2, // 2 hours - same as useSavings
    // IMPORTANT: refetchOnMount was causing random loading states when navigating
    // because it would trigger a refetch every time this component mounted,
    // which would also affect other components using the same query key
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    // Keep previous data during refetch to prevent UI flicker and dialog closing
    placeholderData: keepPreviousData,
    select: (data) => {
      if (!Array.isArray(data)) return [];

      return data.map((saving: {
        id: number;
        userid: number;
        name: string;
        created_at: string;
        amount: string;
        goal: string;
        status: string;
        description: string;
        target_date?: string;
      }) => ({
        id: saving.id,
        userId: String(saving.userid),
        name: saving.name,
        createdAt: saving.created_at,
        amount: parseFloat(saving.amount),
        goal: parseFloat(saving.goal),
        status: saving.status as "active" | "completed" | "atRisk",
        description: saving.description,
        targetDate: saving.target_date
      } as Saving)).sort((a: Saving, b: Saving) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }
  });

  if (isAuthLoading || isLoading || !isFetched) {
    return <SavingsAccountSkeleton />;
  }

  if (error) {
    return <SavingsState variant="error" onRetry={() => refetch()} />;
  }

  if (isFetched && (!savings || savings.length === 0)) {
    return <SavingsState variant="empty" />;
  }

  if (!savings) {
    return <SavingsAccountSkeleton />;
  }


  return (
    <div className="w-full h-full">
      <div className="w-full h-full overflow-x-auto styled-scrollbar">
        <div className="flex gap-3 min-w-full h-full">
          {savings.map((item: Saving) => {
            const progress = Math.round((item.amount / item.goal) * 100);
            return (
              <div
                key={item.id}
                className={cn(
                  "flex flex-col relative overflow-hidden",
                  "w-[260px] shrink-0",
                  "bg-card",
                  "rounded-xl",
                  "border border-border/50",
                  "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
                  "transition-all duration-300",
                  "h-full"
                )}
              >
                {/* Decorative gradient */}
                <div className={cn(
                  "absolute -top-12 -right-12 w-24 h-24 rounded-full opacity-20 blur-2xl",
                  item.status === 'completed' ? "bg-primary" :
                  item.status === 'atRisk' ? "bg-chart-4" : "bg-chart-2"
                )} />

                <div className="p-3 space-y-2.5 relative z-10 flex-1">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5">
                      <PiggyBank className="w-4 h-4 text-primary" />
                    </div>
                    <div
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1",
                        statusConfig[item.status as keyof typeof statusConfig]?.bg,
                        statusConfig[item.status as keyof typeof statusConfig]?.class
                      )}
                    >
                      {React.createElement(statusConfig[item.status as keyof typeof statusConfig]?.icon || AlertCircle, {
                        className: "w-3 h-3",
                      })}
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-0.5">
                      {item.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium text-foreground">{progress}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-bold text-foreground">
                      ${item.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      of ${item.goal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <div className="border-t border-border/50 relative z-10">
                      <button
                        className={cn(
                          "w-full flex items-center justify-center gap-2",
                          "py-2 px-3",
                          "text-xs font-medium",
                          "text-muted-foreground",
                          "hover:text-foreground",
                          "hover:bg-secondary/60",
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
            );
          })}
        </div>
      </div>
    </div>
  );
}
