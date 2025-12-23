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
        <Card className="h-full flex flex-col">
            <div className="flex justify-between p-4 items-center flex-none">
                <CardTitle>Savings</CardTitle>
                <CardDescription>
                    <Link href="/goals" className="text-primary hover:underline" prefetch={true}>
                        View all
                    </Link>
                </CardDescription>
            </div>
            <CardContent className="overflow-y-scroll max-h-[200px] styled-scrollbar">
                <div className="space-y-4">
                    {savings?.map((saving: SavingsType) => (
                        <div key={saving.name} className="space-y-1.5">
                            <p className="text-sm text-muted-foreground">{saving.name}</p>
                            <Progress value={saving.goal ? (saving.amount / saving.goal * 100) : 0} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );

}

export default Savings
