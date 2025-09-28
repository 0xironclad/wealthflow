import { Button } from "@/components/ui/button"
import GenericCard from "@/components/budget/cards"

function Budget() {

  const budgetData = [
    { title: "Total Budget", number: 1000 },
    { title: "Total Spent", number: 500 },
    { title: "Remaining Budget", number: 500, style: "text-green-500" },
    { title: "Budget Progress", number: 500, style: "text-green-500", hasRadialChart: true, progress: 60 },
  ]

  return (
    <div className="h-screen w-full flex flex-col">
      <div className="flex-shrink-0 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button variant="default" className="text-lg">+ New Budget</Button>
      </div>
      <div className="px-4 py-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {budgetData.map((data) => (
          <GenericCard
            key={data.title}
            title={data.title}
            number={data.number}
            style={data.style}
            hasRadialChart={data.hasRadialChart}
            progress={data.progress}
          />
        ))}
      </div>
    </div>
  )
}

export default Budget
