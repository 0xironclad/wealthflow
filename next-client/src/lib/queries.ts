import { useQuery } from "@tanstack/react-query";
import { getExpensesById } from "@/server/expense";
import { getIncomesById } from "@/server/income";

export const useExpenses = (userId: string) => {
  return useQuery({
    queryKey: ["expenses", userId],
    queryFn: () => getExpensesById(userId),
    enabled: !!userId,
    select: (data) =>
      data.map(
        (expense: {
          id: number;
          userid: string;
          name: string;
          date: string;
          amount: string;
          type: "income" | "expense";
          paymentmethod: string;
          category: string;
        }) => ({
          id: expense.id,
          userId: expense.userid,
          name: expense.name,
          date: expense.date,
          amount: parseFloat(expense.amount),
          type: expense.type,
          paymentMethod: expense.paymentmethod,
          category: expense.category,
        })
      ),
    staleTime: 1000 * 30,
  });
};

export const useIncomes = (userId: string) => {
  return useQuery({
    queryKey: ["incomes", userId],
    queryFn: () => getIncomesById(userId),
    enabled: !!userId,
    select: (data) =>
      data.map(
        (income: {
          id: number;
          userid: string;
          name: string;
          date: string;
          amount: string;
          category: string;
          source: string;
        }) => ({
          id: income.id,
          userId: income.userid,
          name: income.name,
          date: income.date,
          amount: parseFloat(income.amount),
          type: "income",
          category: income.category,
          source: income.source,
        })
      ),
    staleTime: 1000 * 30, 
  });
};
