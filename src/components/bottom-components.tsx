"use client";
import dynamic from 'next/dynamic';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Savings = dynamic(() => import("@/components/savings"), {
  loading: () => <SavingsLoadingSkeleton />,
  ssr: false,
});

const SpendTrend = dynamic(() => import("@/components/spend-trend").then(mod => mod.SpendTrend), {
  loading: () => <ChartLoadingSkeleton />,
  ssr: false,
});

const IncomeVSExpense = dynamic(() => import("@/components/income-expense").then(mod => mod.IncomeVSExpense), {
  loading: () => <ChartLoadingSkeleton />,
  ssr: false,
});

const SavingsLoadingSkeleton = () => (
  <Card className="h-full border-border/50">
    <div className="flex justify-between p-4 items-center">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-3 w-14" />
    </div>
    <CardContent className="p-4 pt-0">
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-8" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const ChartLoadingSkeleton = () => (
  <Card className="h-full border-border/50">
    <CardHeader className="pb-2">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-4 w-28 mb-1" />
          <Skeleton className="h-3 w-20" />
        </div>
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </CardHeader>
    <CardContent className="p-2 pt-0">
      <div className="h-[180px] w-full flex flex-col">
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-px w-full opacity-30" />
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 h-20">
            <Skeleton className="h-full w-full rounded-lg opacity-40" />
          </div>
        </div>
        <div className="flex justify-between mt-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-3 w-8" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function BottomComponents() {
  return (
    <>
      {/* Desktop Layout - Fill available height */}
      <div className="hidden lg:grid grid-cols-12 gap-4 h-full">
        <div className="col-span-2 h-full">
          <Savings />
        </div>
        <div className="col-span-10 grid grid-cols-2 gap-4 h-full">
          <div className="h-full">
            <SpendTrend />
          </div>
          <div className="h-full">
            <IncomeVSExpense />
          </div>
        </div>
      </div>

      {/* Tablet Layout - Stacked with some horizontal arrangement */}
      <div className="hidden md:block lg:hidden">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="min-h-[240px]">
            <Savings />
          </div>
          <div className="min-h-[240px]">
            <SpendTrend />
          </div>
        </div>
        <div className="min-h-[240px]">
          <IncomeVSExpense />
        </div>
      </div>

      {/* Mobile Layout - All components stacked vertically */}
      <div className="block md:hidden">
        <div className="flex flex-col gap-4">
          <div className="min-h-[220px]">
            <Savings />
          </div>
          <div className="min-h-[240px]">
            <SpendTrend />
          </div>
          <div className="min-h-[240px]">
            <IncomeVSExpense />
          </div>
        </div>
      </div>
    </>
  );
}