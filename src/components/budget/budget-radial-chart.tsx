import { Label, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import { ChartContainer } from "@/components/ui/chart"

export function BudgetRadialChart({
  totalBudget = 0,
  totalSpent = 0,
}: {
  totalBudget?: number
  totalSpent?: number
}) {
  const budget = typeof totalBudget === "number" ? totalBudget : 0
  const spent = typeof totalSpent === "number" ? totalSpent : 0
  const percentUsed = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0

  const data = [
    {
      name: "Budget",
      value: percentUsed,
      fill: percentUsed > 90 ? "hsl(var(--destructive))" : percentUsed > 70 ? "hsl(var(--chart-4))" : "hsl(var(--chart-2))"
    }
  ]

  return (
    <ChartContainer
      config={{
        spent: {
          label: "Spent",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="w-full h-full"
    >
      <RadialBarChart
        data={data}
        startAngle={90}
        endAngle={90 - (360 * percentUsed / 100)}
        innerRadius={80}
        outerRadius={140}
        barSize={20}
        width={300}
        height={300}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[86, 74]}
        />
        <RadialBar
          dataKey="value"
          cornerRadius={10}
          fill={percentUsed > 90 ? "hsl(var(--destructive))" : percentUsed > 70 ? "hsl(var(--chart-4))" : "hsl(var(--chart-2))"}
          maxBarSize={20}
        />
        <PolarRadiusAxis
          tick={false}
          tickLine={false}
          axisLine={false}
          domain={[0, 100]}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 12} className="fill-foreground text-4xl font-bold">
                      {percentUsed}%
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 16} className="fill-muted-foreground text-sm">
                      ${spent.toLocaleString()} / ${budget.toLocaleString()}
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  )
}
