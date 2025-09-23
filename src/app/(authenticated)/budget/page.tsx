import BudgetHealth from "@/components/budget/budget-health";

function Budget() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <h1 className="text-3xl font-bold">Budget Manager</h1>
      </div>
      <div className="flex-1 overflow-y-auto styled-scrollbar px-4">
        <div className="w-full h-10">
          <BudgetHealth totalBudget={1000} totalSpent={500} />
        </div>
      </div>
    </div>
  )
}

export default Budget