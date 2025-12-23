import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { SavingsType } from "@/lib/types"
import { useUser } from "@/context/UserContext"
import { SavingsNoData } from "./empty states/no-data-savings"
import { useSavings } from "@/lib/queries"
import LoadingComponent from "./loading-component"

function Savings() {
    const { user, isLoading: isAuthLoading } = useUser();

    // Only call the hook with a valid userId - pass empty string when not ready
    // The hook will be disabled when userId is empty
    const userId = user?.id ?? '';
    const { data: savings, isPending, isError } = useSavings(userId);

    // Show loading while auth is loading or we don't have a user yet
    if (isAuthLoading || !user?.id) {
        return <LoadingComponent title="Savings" />
    }

    // Show loading only when actually fetching data (not when query is disabled)
    // isPending is true when query has no data yet AND is enabled
    // isFetching is true when query is actively fetching
    if (isPending && !savings) {
        return <LoadingComponent title="Savings" />
    }

    // Only show loading on error if we have no cached data to display
    if (isError && !savings) {
        return <LoadingComponent title="Savings" />
    }

    const hasNoSavings = !savings || savings.length === 0;

    return hasNoSavings ? (
        <SavingsNoData />
    ) : (
        <Card className="h-full flex flex-col relative overflow-hidden border-border/50">
            {/* Decorative background */}
            <div className="absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-primary/5 blur-3xl" />

            <div className="flex justify-between p-4 items-center flex-none relative z-10">
                <CardTitle className="text-sm font-semibold">Savings</CardTitle>
                <Link
                    href="/goals"
                    className="text-xs font-medium text-primary hover:underline"
                    prefetch={true}
                >
                    View all
                </Link>
            </div>
            <CardContent className="flex-1 overflow-y-auto styled-scrollbar p-4 pt-0 relative z-10">
                <div className="space-y-4">
                    {savings?.map((saving: SavingsType) => {
                        const progress = saving.goal ? (saving.amount / saving.goal * 100) : 0;
                        return (
                            <div key={saving.name} className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm font-medium text-foreground">{saving.name}</p>
                                    <span className="text-xs text-muted-foreground">
                                        {Math.round(progress)}%
                                    </span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );

}

export default Savings
