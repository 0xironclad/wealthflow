import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ExpenseCardProps } from "@/lib/types";

const ExpenseCard = ({name, amount, percentageChange, type}: ExpenseCardProps) => {
  const isPositive = percentageChange > 0;
  const isZero = percentageChange === 0;
  const isGreen = (type === 'income' && isPositive) || (type === 'expense' && !isPositive);

  return (
    <Card className={cn("w-[250px]")}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          {name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-semibold">
            ${amount.toLocaleString()}
          </span>
          <div className={cn(
            "px-2 py-1 rounded-md text-sm font-medium",
            isGreen
              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
              : isZero ? "bg-gray-100 text-gray-600 dark:bg-gray-400 dark:text-gray-400" :
              "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
          )}>
            {isPositive ? "↑" : isZero ? " " : "↓"} {Math.abs(percentageChange).toFixed(2)}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseCard;
