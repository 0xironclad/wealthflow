import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
    ArrowUpRight,
    ArrowDownLeft,
    Receipt,
    Plus,
    Clock,
    TrendingUp,
    CreditCard,
    Wallet
} from "lucide-react"

export function LatestTransactionsNoData() {
    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex-none pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Latest Transactions
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs font-bold text-zinc-600 dark:text-zinc-400 mt-0">
                        This Month - <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">0</span>
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="flex-1 flex items-center justify-center relative">
                {/* Background decorative elements */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-chart-1 to-chart-3 blur-3xl" />
                </div>

                <div className="relative z-10 flex flex-col items-center space-y-6 text-center px-4">
                    {/* Main icon with transaction theme */}
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-chart-1/20 to-chart-3/20 flex items-center justify-center mb-4">
                            <Receipt className="w-10 h-10 text-chart-1" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-chart-2/20 flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 text-chart-2" />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-foreground">
                            No transactions yet
                        </h3>
                    </div>

                    {/* Action button */}
                    <Link href="/transaction" className="w-full">
                        <Button className="w-full bg-gradient-to-r from-chart-1 to-chart-2 hover:from-chart-1/90 hover:to-chart-2/90 text-primary-foreground border-0">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Your First Transaction
                        </Button>
                    </Link>

                    {/* Visual indicators */}
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-chart-1" />
                            <span>Income</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-destructive" />
                            <span>Expenses</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-chart-3" />
                            <span>Transfers</span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 