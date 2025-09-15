import { SavingStatus } from "./types";

export const determineStatus = (amount: number, goal: number, targetDate: string, createdAt: string): SavingStatus => {
    const today = new Date();
    const target = new Date(targetDate);
    const created = new Date(createdAt);

    if (amount >= goal) {
        return "completed";
    }

    if (target < today) {
        return "atRisk";
    }

    const totalDays = Math.max(1, Math.ceil((target.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));
    const daysElapsed = Math.max(1, Math.ceil((today.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)));


    const expectedDailySavings = goal / totalDays;
    const actualDailySavings = amount / daysElapsed;
  
    if (actualDailySavings < expectedDailySavings * 0.7) {
        return "atRisk";
    }

    return "active";
}
