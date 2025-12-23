"use client";
import { Suspense } from "react";
import DashboardTopRow from "@/components/dashboard-top-row";
import AccountsCard from "@/components/accounts";
import ExpenseDistribution from "@/components/expense-distribution";
import LatestTransactions from "@/components/latest-transactions";
import BottomComponents from "@/components/bottom-components";
import LoginToast from "./LoginToast";

export default function Overview() {
    return (
        <>
            <Suspense fallback={null}>
                <LoginToast />
            </Suspense>
            <div className="h-full w-full flex flex-col overflow-hidden">
                <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <h1 className="text-3xl font-bold">Overview</h1>
                </div>

                {/* Desktop Layout - Fill viewport height */}
                <div className="hidden lg:flex flex-col flex-1 gap-4 px-4 pb-4 min-h-0">
                    {/* Top - Fixed height for metric cards */}
                    <div className="w-full h-[140px] flex-shrink-0">
                        <DashboardTopRow />
                    </div>

                    {/* Middle - Flexible height (takes ~40% of remaining space) */}
                    <div className="flex gap-4 w-full flex-[4] min-h-0">
                        <div className="flex-1 min-h-0">
                            <AccountsCard />
                        </div>
                        <div className="flex-1 min-h-0">
                            <ExpenseDistribution />
                        </div>
                        <div className="flex-1 min-h-0">
                            <LatestTransactions />
                        </div>
                    </div>

                    {/* Bottom - Flexible height (takes ~35% of remaining space) */}
                    <div className="w-full flex-[3.5] min-h-0">
                        <BottomComponents />
                    </div>
                </div>

                {/* Tablet Layout - Scrollable */}
                <div className="hidden md:flex lg:hidden flex-col flex-1 gap-4 px-4 pb-4 overflow-y-auto styled-scrollbar">
                    {/* Top row - fixed height */}
                    <div className="w-full h-[140px] flex-shrink-0">
                        <DashboardTopRow />
                    </div>

                    {/* Middle row - 2x2 grid */}
                    <div className="grid grid-cols-2 gap-4 min-h-[500px]">
                        <div className="col-span-1 min-h-[240px]">
                            <AccountsCard />
                        </div>
                        <div className="col-span-1 min-h-[240px]">
                            <ExpenseDistribution />
                        </div>
                        <div className="col-span-2 min-h-[240px]">
                            <LatestTransactions />
                        </div>
                    </div>

                    {/* Bottom row */}
                    <div className="w-full min-h-[320px]">
                        <BottomComponents />
                    </div>
                </div>

                {/* Mobile Layout - Stacked & Scrollable */}
                <div className="flex md:hidden flex-col flex-1 gap-4 px-4 pb-4 overflow-y-auto styled-scrollbar">
                    {/* All components stacked vertically */}
                    <div className="w-full h-[140px] flex-shrink-0">
                        <DashboardTopRow />
                    </div>

                    <div className="w-full min-h-[280px]">
                        <AccountsCard />
                    </div>

                    <div className="w-full min-h-[280px]">
                        <ExpenseDistribution />
                    </div>

                    <div className="w-full min-h-[280px]">
                        <LatestTransactions />
                    </div>

                    <div className="w-full min-h-[350px]">
                        <BottomComponents />
                    </div>
                </div>
            </div>
        </>
    );
}
