"use client";
import DashboardTopRow from "@/components/dashboard-top-row";
import AccountsCard from "@/components/accounts";
import ExpenseDistribution from "@/components/expense-distribution";
import LatestTransactions from "@/components/latest-transactions";
import BottomComponents from "@/components/bottom-components";

export default function Overview() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 p-4  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>

      <div className="flex-1 overflow-y-auto styled-scrollbar px-4">
        <div className="hidden lg:flex flex-col gap-6">
          {/* Top - Fixed height for cards */}
          <div className="w-full h-[160px]">
            <DashboardTopRow />
          </div>

          {/* Middle - Natural height */}
          <div className="flex gap-4 w-full min-h-[350px]">
            <div className="flex-1">
              <AccountsCard />
            </div>
            <div className="flex-1">
              <ExpenseDistribution />
            </div>
            <div className="flex-1">
              <LatestTransactions />
            </div>
          </div>

          {/* Bottom - Natural height */}
          <div className="w-full min-h-[400px]">
            <BottomComponents />
          </div>
        </div>

        {/* Tablet Layout - Flexible heights */}
        <div className="hidden md:flex lg:hidden flex-col gap-6">
          {/* Top row - fixed height */}
          <div className="w-full h-[160px]">
            <DashboardTopRow />
          </div>

          {/* Middle row - 2x2 grid */}
          <div className="grid grid-cols-2 gap-4 min-h-[350px]">
            <div className="col-span-1 min-h-[300px]">
              <AccountsCard />
            </div>
            <div className="col-span-1 min-h-[300px]">
              <ExpenseDistribution />
            </div>
            <div className="col-span-2 min-h-[300px]">
              <LatestTransactions />
            </div>
          </div>

          {/* Bottom row */}
          <div className="w-full min-h-[400px]">
            <BottomComponents />
          </div>
        </div>

        {/* Mobile Layout - Stacked */}
        <div className="flex md:hidden flex-col gap-6">
          {/* All components stacked vertically */}
          <div className="w-full h-[160px]">
            <DashboardTopRow />
          </div>

          <div className="w-full min-h-[300px]">
            <AccountsCard />
          </div>

          <div className="w-full min-h-[300px]">
            <ExpenseDistribution />
          </div>

          <div className="w-full min-h-[300px]">
            <LatestTransactions />
          </div>

          <div className="w-full min-h-[400px]">
            <BottomComponents />
          </div>
        </div>
      </div>
    </div>
  );
}