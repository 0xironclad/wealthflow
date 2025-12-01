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

    const { data: savings, isPending, isError, error, isFetching, isLoading, status, fetchStatus } = useSavings(user?.id ?? '');

    // Debug logs
    console.log('[Savings Component] State:', {
        userId: user?.id,
        isPending,
        isLoading,
        isFetching,
        isError,
        error: error,
        status,
        fetchStatus,
        isAuthLoading,
        hasSavings: !!savings,
        savingsCount: savings?.length
    });

    if (isAuthLoading) {
        console.log('[Savings] Showing loading: Auth loading');
        return <LoadingComponent title="Savings" />
    }
    if (!user?.id) {
        console.log('[Savings] No user ID, returning null');
        return null;
    }

    if (isPending) {
        console.log('[Savings] Showing loading: isPending');
        return <LoadingComponent title="Savings" />
    }

    if (isError && !savings) {
        console.log('[Savings] Showing loading: Error state with no data');
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
