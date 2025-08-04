"use client";
import dynamic from 'next/dynamic';
import { Loader2 } from "lucide-react";

const CardContent = dynamic(() => import("@/components/ui/card").then(mod => mod.CardContent), { ssr: false });
const Card = dynamic(() => import("@/components/ui/card").then(mod => mod.Card), { ssr: false });

const Savings = dynamic(() => import("@/components/savings"), {
  loading: () => <LoadingComponent />,
  ssr: false,
});

const SpendTrend = dynamic(() => import("@/components/spend-trend").then(mod => mod.SpendTrend), {
  loading: () => <LoadingComponent />,
  ssr: false,
});

const IncomeVSExpense = dynamic(() => import("@/components/income-expense").then(mod => mod.IncomeVSExpense), {
  loading: () => <LoadingComponent />,
  ssr: false,
});

const LoadingComponent = () => (
  <Card className="h-full">
    <CardContent className="flex items-center justify-center h-[200px]">
      <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </CardContent>
  </Card>
);

export default function BottomComponents() {
  return (
    <>
      {/* Desktop Layout - Original grid layout */}
      <div className="hidden lg:grid grid-cols-12 gap-4 h-[380px] pb-5">
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
      <div className="hidden md:block lg:hidden pb-5">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="h-[280px]">
            <Savings />
          </div>
          <div className="h-[280px]">
            <SpendTrend />
          </div>
        </div>
        <div className="h-[280px]">
          <IncomeVSExpense />
        </div>
      </div>

      {/* Mobile Layout - All components stacked vertically */}
      <div className="block md:hidden pb-5">
        <div className="flex flex-col gap-4">
          <div className="h-[250px]">
            <Savings />
          </div>
          <div className="h-[280px]">
            <SpendTrend />
          </div>
          <div className="h-[280px]">
            <IncomeVSExpense />
          </div>
        </div>
      </div>
    </>
  );
}