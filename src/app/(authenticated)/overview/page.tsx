"use client";
import DashboardTopRow from "@/components/dashboard-top-row";
import AccountsCard from "@/components/accounts";
import ExpenseDistribution from "@/components/expense-distribution";
import LatestTransactions from "@/components/latest-transactions";
import BottomComponents from "@/components/bottom-components";

export default function Overview() {
  return (
    <div className="w-full max-w-[100vw] h-[calc(100vh-1.75rem)] flex flex-col overflow-hidden">
      <div className="p-4 sticky top-0 bg-background z-20 flex-shrink-0">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>

      <div className="flex-1 p-4 pt-0 pb-10 overflow-auto styled-scrollbar">
        <div className="hidden lg:flex h-full flex-col gap-4">
          {/* Top - 20% of parent height */}
          <div className="w-full h-[20%] min-h-[200px]">
            <DashboardTopRow />
          </div>

          {/* Middle - 40% of parent height */}
          <div className="flex gap-4 w-full h-[40%] min-h-[300px]">
            <div className="flex-1 h-full">
              <AccountsCard />
            </div>
            <div className="flex-1 h-full">
              <ExpenseDistribution />
            </div>
            <div className="flex-1 h-full">
              <LatestTransactions />
            </div>
          </div>

          {/* Bottom - 40% of parent height */}
          <div className="w-full h-[40%] min-h-[300px]">
            <BottomComponents />
          </div>
        </div>

        {/* Tablet Layout - Flexible heights */}
        <div className="hidden md:flex lg:hidden flex-col gap-4">
          {/* Top row - natural height */}
          <div className="w-full min-h-[200px]">
            <DashboardTopRow />
          </div>

          {/* Middle row - 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 min-h-[300px]">
            <div className="col-span-1">
              <AccountsCard />
            </div>
            <div className="col-span-1">
              <ExpenseDistribution />
            </div>
            <div className="col-span-2">
              <LatestTransactions />
            </div>
          </div>

          {/* Bottom row */}
          <div className="w-full min-h-[300px]">
            <BottomComponents />
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="flex md:hidden flex-col gap-4">
          {/* All components stacked vertically */}
          <div className="w-full min-h-[200px]">
            <DashboardTopRow />
          </div>

          <div className="w-full min-h-[250px]">
            <AccountsCard />
          </div>

          <div className="w-full min-h-[250px]">
            <ExpenseDistribution />
          </div>

          <div className="w-full min-h-[250px]">
            <LatestTransactions />
          </div>

          <div className="w-full min-h-[300px]">
            <BottomComponents />
          </div>
        </div>
      </div>
    </div>
  );
}