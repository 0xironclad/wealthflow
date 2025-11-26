import { Card, CardHeader, CardTitle, CardContent } from "../ui/card"
import { TrendingDown, BarChart3 } from "lucide-react"

export function ExpenseDistributionNoData() {
    return (<Card className="h-full w-full">
        <CardHeader className="pb-3">
            <div>
                <CardTitle className="text-sm">Expense Distribution</CardTitle>
            </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 h-[calc(100%-4rem)]">
            {/* Empty state with visual elements */}
            <div className="flex-1 flex items-center justify-center relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <div className="w-32 h-32 rounded-full bg-primary blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
                    {/* Animated icon container */}
                    <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-2">
                            <TrendingDown className="w-8 h-8 text-primary" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center">
                            <BarChart3 className="w-3 h-3 text-primary" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">
                            No expenses to analyze yet
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
                            Start tracking your expenses to see beautiful charts and insights about your spending patterns.
                        </p>
                    </div>



                    {/* Visual indicators */}
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            <span>Food</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-primary/70" />
                            <span>Transport</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-primary/40" />
                            <span>Entertainment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decorative bar */}
            <div className="h-1 bg-primary rounded-full opacity-20" />
        </CardContent>
    </Card>)
}
