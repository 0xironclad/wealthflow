import BudgetHealth from "@/components/budget/budget-health"
import { BudgetsTooltip } from "@/components/budget/budgets-tooltip"

function Budget() {
  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-3xl font-bold">Budget Manager</h1>
      </div>
      {/* First row */}
      <div className="flex-1 overflow-y-auto styled-scrollbar px-4 flex flex-col gap-4">
        <div className="w-full">
          <BudgetHealth totalBudget={1000} totalSpent={500} />
        </div>
        {/* second row */}
        <div className="grid grid-cols-12 gap-4 h-96 w-full overflow-hidden">
          <div className="col-span-8 h-full overflow-hidden">
            <BudgetsTooltip />
          </div>
          <div className="col-span-4">
            <BudgetHealth totalBudget={1000} totalSpent={500} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Budget
