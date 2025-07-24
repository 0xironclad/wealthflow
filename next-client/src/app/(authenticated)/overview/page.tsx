"use client";

import DashboardTopRow from "@/components/dashboard-top-row";
import AccountsCard from '@/components/accounts';
import ExpenseDistribution from '@/components/expense-distribution';
import LatestTransactions from '@/components/latest-transactions';
import BottomComponents from '@/components/bottom-components';

export default function Overview() {
  return (
    <div className="w-full max-w-[100vw] min-h-[calc(100vh-1.75rem)] flex flex-col overflow-auto styled-scrollbar">
      <div className="p-4 sticky top-0 bg-background z-20">
        <h1 className="text-3xl font-bold">Overview</h1>
      </div>
      <div className="flex-1 p-4 pt-0 pb-10 styled-scrollbar">
        <div className="flex flex-col gap-4">
          <div className="w-full">
            <DashboardTopRow />
          </div>
          {/* Middle */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <div className="w-full md:flex-1 h-[250px]">
              <AccountsCard />
            </div>
            <div className="w-full md:flex-1 h-[250px]">
              <ExpenseDistribution />
            </div>
            <div className="w-full md:flex-1 h-[250px]">
              <LatestTransactions />
            </div>
          </div>

          {/* Bottom */}
          <div className="w-full h-[250px]">
            <BottomComponents />
          </div>
        </div>
      </div>
    </div>
  );
}
