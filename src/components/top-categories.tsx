"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useMemo } from "react"
import { InvoiceType } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface CategoryTotal {
  title: string;
  amount: number;
}

interface TopCategoriesProps {
  expenses: InvoiceType[];
  isLoading?: boolean;
}

const Category = ({ category, amount }: { category: string; amount: number }) => {
  return (
    <div className="flex items-center space-x-2 justify-between">
      <div>{category}</div>
      <div className={amount > 0 ? "text-green-600" : "text-red-600"} >
        ${Math.abs(amount).toFixed(2)}
      </div>
    </div>
  );
};

const TopCategories = ({ expenses, isLoading = false }: TopCategoriesProps) => {
  const categories = useMemo(() => {
    const expenseOnly = expenses.filter(exp => exp.type === 'expense');

    const categoryTotals = expenseOnly.reduce((acc, curr) => {
      const existing = acc.find(cat => cat.title === curr.category);
      if (existing) {
        existing.amount += curr.amount;
      } else {
        acc.push({ title: curr.category, amount: curr.amount });
      }
      return acc;
    }, [] as CategoryTotal[]);

    return categoryTotals
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [expenses]);

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Top spending Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[200px]">
          <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Top spending Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="list-decimal space-y-2 pl-4">
          {categories.map((item) => (
            <li key={item.title}>
              <Category category={item.title} amount={item.amount} />
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
};

export default TopCategories;
