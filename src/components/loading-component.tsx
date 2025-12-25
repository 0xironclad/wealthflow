import { Card, CardContent, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'

interface LoadingComponentProps {
    title: string;
}

function LoadingComponent({ title }: LoadingComponentProps) {
    // Different skeleton structures based on common component patterns
    const isChartComponent = title.toLowerCase().includes('spent') ||
                            title.toLowerCase().includes('income') ||
                            title.toLowerCase().includes('expense');
    const isSavingsComponent = title.toLowerCase().includes('saving');
    const isTransactionsComponent = title.toLowerCase().includes('transaction');
    const isDistributionComponent = title.toLowerCase().includes('distribution');

    return (
        <Card className="h-full border-border/50">
            <CardHeader className="pb-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24 mt-1" />
            </CardHeader>
            <CardContent className="flex-1">
                {isChartComponent ? (
                    // Chart skeleton
                    <div className="h-[180px] w-full flex flex-col">
                        <div className="flex-1 relative">
                            <div className="absolute inset-0 flex flex-col justify-between">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-px w-full opacity-30" />
                                ))}
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 h-20">
                                <Skeleton className="h-full w-full rounded-lg opacity-40" />
                            </div>
                        </div>
                        <div className="flex justify-between mt-2">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="h-3 w-8" />
                            ))}
                        </div>
                    </div>
                ) : isSavingsComponent ? (
                    // Savings list skeleton
                    <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-8" />
                                </div>
                                <Skeleton className="h-2 w-full rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : isTransactionsComponent ? (
                    // Transactions list skeleton
                    <div className="space-y-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-2">
                                <Skeleton className="h-9 w-9 rounded-xl" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-28" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-4 w-16" />
                            </div>
                        ))}
                    </div>
                ) : isDistributionComponent ? (
                    // Pie chart distribution skeleton
                    <div className="flex flex-col gap-3 h-[180px]">
                        <div className="grid grid-cols-3 gap-2">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-12 rounded-lg" />
                            ))}
                        </div>
                        <div className="flex-1 flex">
                            <div className="w-1/2 flex items-center justify-center">
                                <Skeleton className="h-24 w-24 rounded-full" />
                            </div>
                            <div className="w-1/2 flex flex-col justify-center space-y-2">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <Skeleton className="h-3 w-3 rounded-full" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    // Default generic skeleton
                    <div className="space-y-3 h-[180px]">
                        {[...Array(4)].map((_, i) => (
                            <Skeleton key={i} className="h-8 w-full" />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default LoadingComponent