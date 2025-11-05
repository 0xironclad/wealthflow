"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { InsightsSummaryCards } from "@/components/insights-summary-page";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getSavings } from "@/server/saving";
import { getBudgetsById } from "@/server/budget";
import { useState, useEffect } from "react";
import { Saving } from "@/lib/types";
import { useUser } from "@/context/UserContext";
import { getOverviewRecommendation } from "@/server/ai";
import { RecommendationType } from "@/lib/types";

// Mock data
const monthlySavingsData = [
  { month: "Oct", value: 450 },
  { month: "Nov", value: 520 },
  { month: "Dec", value: 480 },
  { month: "Jan", value: 590 },
  { month: "Feb", value: 640 },
  { month: "Mar", value: 720 },
];

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const STORAGE_KEY = 'insights_recommendations_cache';

interface CachedRecommendations {
  recommendations: RecommendationType[];
  timestamp: number;
}

type BudgetPerformance = {
  name: string;
  budget: number;
  spent: number;
  percentage: number;
};

// Move this outside the component since it doesn't need component state
const shouldFetchNewRecommendations = (cached: CachedRecommendations | null): boolean => {
  if (!cached) return true;
  return Date.now() - cached.timestamp > CACHE_DURATION;
};

export default function InsightsPage() {
  const { user, isLoading: isLoadingUser } = useUser();
  const [recommendations, setRecommendations] = useState<RecommendationType[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);

  const getCachedRecommendations = (): CachedRecommendations | null => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (!cached) return null;
      return JSON.parse(cached);
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  };

  const setCachedRecommendations = (data: RecommendationType[]) => {
    try {
      const cacheData: CachedRecommendations = {
        recommendations: data,
        timestamp: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  };

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!user?.id) return;

      const cached = getCachedRecommendations();
      if (cached && !shouldFetchNewRecommendations(cached)) {
        setRecommendations(cached.recommendations);
        return;
      }

      setIsLoadingRecommendations(true);
      try {
        const data = await getOverviewRecommendation(user.id);
        if (Array.isArray(data)) {
          setRecommendations(data);
          setCachedRecommendations(data);
        } else {
          console.error('Recommendations data is not an array:', data);
          setRecommendations([]);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setRecommendations([]);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };

    fetchRecommendations();
  }, [user]); // Remove shouldFetchNewRecommendations from dependencies

  const handleRefreshRecommendations = () => {
    localStorage.removeItem(STORAGE_KEY);
    if (user?.id) {
      getOverviewRecommendation(user.id)
        .then((data) => {
          if (Array.isArray(data)) {
            setRecommendations(data);
            setCachedRecommendations(data);
          }
        })
        .catch((error) => {
          console.error('Error refreshing recommendations:', error);
        });
    }
  };

  const { data: savings, isLoading: isLoadingSavings } = useQuery({
    queryKey: ['savings', user?.id],
    queryFn: () => getSavings(user?.id ?? ''),
    enabled: !!user?.id && !isLoadingUser,
    select: (data) => data.map((saving: {
      id: number;
      userid: number;
      name: string;
      created_at: string;
      target_date: string;
      amount: string;
      goal: string;
      status: string;
      description: string;
    }) => ({
      id: saving.id,
      userId: saving.userid,
      name: saving.name,
      createdAt: saving.created_at,
      targetDate: saving.target_date,
      amount: parseFloat(saving.amount),
      goal: parseFloat(saving.goal),
      status: saving.status,
      description: saving.description
    })).sort((a: Saving, b: Saving) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  });

  const { data: budgets } = useQuery({
    queryKey: ['budgets', user?.id],
    queryFn: () => user ? getBudgetsById(user.id) : Promise.resolve({ success: true, data: [] }),
    enabled: !!user,
    select: (data) => {
      if (!data.success || !data.data) return [];
      return data.data.map((budget: {
        id: number;
        user_id: number;
        name: string;
        description: string;
        period_type: string;
        start_date: string;
        end_date: string;
        category: string;
        planned_amount: number;
        spent_amount: number;
        is_rollover: boolean;
      }) => ({
        id: budget.id,
        userId: budget.user_id,
        name: budget.name,
        description: budget.description,
        periodType: budget.period_type,
        startDate: budget.start_date,
        endDate: budget.end_date,
        category: budget.category,
        plannedAmount: Number(budget.planned_amount),
        spentAmount: Number(budget.spent_amount),
        rollOver: budget.is_rollover ? "Yes" : "No"
      }));
    }
  });

  // *SAVINGS COMPUTATIONS
  const calculateTotalSavingProgress = (savings: Saving[] | undefined) => {
    if (!savings || savings.length === 0) return 0;
    const amount = savings.reduce((total, saving) => total + (saving.amount || 0), 0);
    const goal = savings.reduce((total, saving) => total + (saving.goal || 0), 0);
    return goal === 0 ? 0 : (amount / goal) * 100;
  }
  const progress: number = isLoadingSavings || isLoadingUser ? 0 : parseFloat(calculateTotalSavingProgress(savings).toFixed(1));

  const calculateSavingsSchedule = (savings: Saving[] | undefined): number => {
    if (!savings || savings.length === 0) return 0;

    let totalMonthsAheadBehind = 0;

    savings.forEach(saving => {
      const today = new Date();
      const startDate = new Date(saving.createdAt);
      const targetDate = new Date(saving.targetDate);

      const totalTimeframe = targetDate.getTime() - startDate.getTime();
      const timeElapsed = today.getTime() - startDate.getTime();
      const expectedProgress = (timeElapsed / totalTimeframe) * saving.goal;
      const actualProgress = saving.amount;
      const progressDifference = actualProgress - expectedProgress;

      const monthlyRate = saving.goal / (totalTimeframe / (1000 * 60 * 60 * 24 * 30.44));
      const monthsAheadBehind = progressDifference / monthlyRate;

      totalMonthsAheadBehind += monthsAheadBehind;
    });
    return Number((totalMonthsAheadBehind / savings.length).toFixed(1));
  };

  const getSavingsScheduleStatus = (monthsAheadBehind: number) => {
    if (monthsAheadBehind > 0) {
      return {
        status: 'Ahead',
        months: Math.abs(monthsAheadBehind),
        text: `${Math.abs(monthsAheadBehind)} ${Math.abs(monthsAheadBehind) === 1 ? 'month' : 'months'} ahead of schedule`
      };
    } else if (monthsAheadBehind < 0) {
      return {
        status: 'Behind',
        months: Math.abs(monthsAheadBehind),
        text: `${Math.abs(monthsAheadBehind)} ${Math.abs(monthsAheadBehind) === 1 ? 'month' : 'months'} behind schedule`
      };
    } else {
      return {
        status: 'On track',
        months: 0,
        text: 'On track'
      };
    }
  };

  const monthsAheadBehind = calculateSavingsSchedule(savings);
  const savingsScheduleStatus = getSavingsScheduleStatus(monthsAheadBehind);
  const progressStatus = {
    status: savingsScheduleStatus.status,
    months: savingsScheduleStatus.months,
    text: savingsScheduleStatus.text,
    progress: progress
  };

  // * BUDGET COMPUTATIONS
  const budgetPerformance = budgets?.map((budget: {
    name: string;
    plannedAmount: number;
    spentAmount: number;
  }) => ({
    name: budget.name,
    budget: budget.plannedAmount,
    spent: budget.spentAmount,
    percentage: (budget.spentAmount / budget.plannedAmount) * 100
  }));

  const calculateBudgetProgress = (budgets: BudgetPerformance[] | undefined) => {
    if (!budgets || budgets.length === 0) return 0;
    const totalBudget = budgets.reduce((total: number, budget: BudgetPerformance) => total + budget.budget, 0);
    const totalSpent = budgets.reduce((total: number, budget: BudgetPerformance) => total + budget.spent, 0);
    return totalBudget === 0 ? 0 : (totalSpent / totalBudget) * 100;
  }

  const budgetProgress: number = isLoadingSavings || isLoadingUser ? 0 : parseFloat(calculateBudgetProgress(budgetPerformance).toFixed(1));

  const budgetsOverSpentCount = budgetPerformance?.filter((category: BudgetPerformance) => category.spent > category.budget).length ?? 0;
  const overspentBudgets: string[] = budgetPerformance?.filter((category: BudgetPerformance) => category.spent > category.budget).map((category: BudgetPerformance) => category.name) ?? [];

  const budgetHealthPropData = {
    budgetProgress: Math.round(budgetProgress),
    budgetsOverSpentCount: budgetsOverSpentCount,
    overspentBudgets: overspentBudgets
  }


  return (
    <div className="w-full h-screen max-w-[100vw] px-4 pb-10 flex flex-col overflow-hidden ">
      <h1 className="text-3xl font-bold py-4">Insights</h1>

      <div className="flex-1 flex flex-col space-y-5 min-h-0">
        {/* Top Row - Summary Cards */}
        <div className="flex-none">
          <InsightsSummaryCards progressStatus={progressStatus} budgetHealthPropData={budgetHealthPropData} />
        </div>

        {/* Middle Section - Charts and Recommendations */}
        <div className="flex-1 h-[150px] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Column - AI Recommendations */}
          <Card className="md:col-span-1 flex flex-col min-h-0">
            <CardHeader className="flex-none">
              <div className="flex justify-between items-center">
                <CardTitle>AI Recommendations</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshRecommendations}
                  disabled={isLoadingRecommendations}
                >
                  {isLoadingRecommendations ? (
                    <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  ) : (
                    "Refresh"
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto min-h-0">
              <div className="space-y-4 styled-scrollbar max-h-full overflow-y-auto pr-2">
                {isLoadingRecommendations ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                  </div>
                ) : (
                  recommendations.map((recommendation, index) => (
                    <div
                      key={index}
                      className="space-y-2 p-4 bg-secondary/10 rounded-lg dark:bg-secondary/30"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium flex-1">{recommendation.title}</p>
                        <span className={cn(
                          "text-xs px-2 py-1 rounded-full",
                          {
                            "bg-destructive/20 text-destructive": recommendation.priority === "high",
                            "bg-yellow-500/20 text-yellow-600": recommendation.priority === "medium",
                            "bg-green-500/20 text-green-600": recommendation.priority === "low"
                          }
                        )}>
                          {recommendation.priority}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{recommendation.description}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right Column - Charts */}
          <Card className="md:col-span-2 flex flex-col min-h-0">
            <Tabs defaultValue="budget" className="flex-1 flex flex-col min-h-0">
              <TabsList className="flex-none grid w-full grid-cols-2">
                <TabsTrigger value="budget">Budget</TabsTrigger>
                <TabsTrigger value="savings">Savings</TabsTrigger>
              </TabsList>
              <TabsContent value="budget" className="flex-1 min-h-0 mt-0">
                <div className="h-full overflow-auto">
                  <div className="p-4">
                    <h3 className="text-sm font-medium mb-2">
                      Budget Performance
                    </h3>
                    <div className="space-y-4">
                      {budgetPerformance?.map((category: BudgetPerformance) => (
                        <div key={category.name} className="space-y-2 p-4 bg-secondary/10 rounded-lg dark:bg-secondary/30">
                          <div className="flex justify-between text-sm">
                            <span>{category.name}</span>
                            <span>
                              ${category.spent.toFixed(2)} / $
                              {category.budget.toFixed(2)}
                            </span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full relative">
                            <div
                              className={cn(
                                "absolute top-0 left-0 h-2 rounded-full",
                                category.percentage > 100
                                  ? "bg-destructive"
                                  : "bg-primary"
                              )}
                              style={{
                                width: `${Math.min(category.percentage, 100)}%`,
                              }}
                            />
                            {category.percentage > 100 && (
                              <div
                                className="absolute top-0 right-0 h-2 border-l-2 border-destructive"
                                style={{ left: `100%` }}
                              />
                            )}
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                              {category.percentage.toFixed(0)}% used
                            </span>
                            <span>
                              {category.percentage > 100
                                ? `$${(
                                  category.spent - category.budget
                                ).toFixed(2)} over`
                                : `$${(
                                  category.budget - category.spent
                                ).toFixed(2)} left`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="savings" className="flex-1 min-h-0 mt-0">
                <div className="h-full flex flex-col">
                  <div className="h-[250px] w-full flex-none">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlySavingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`$${value}`, "Saved"]}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex-1 mt-4 overflow-auto">
                    <div className="text-sm text-muted-foreground">
                      <ul className="list-disc pl-5 space-y-1">
                        <li>
                          Your savings rate is 15% of your income, which is on
                          track for your goals.
                        </li>
                        <li>March shows your highest savings month at $720.</li>
                        <li>
                          Implementing recommendations could increase your
                          monthly savings by $.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
