import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProgressRadial } from "./progress-radial";
import { Wallet, TrendingDown, PiggyBank } from "lucide-react";

interface GenericCardProps {
    title: string;
    number: number;
    style?: string;
    hasRadialChart?: boolean;
    progress?: number;
}

// Map titles to icons
const iconMap: Record<string, React.ElementType> = {
    "Total Budget": Wallet,
    "Total Spent": TrendingDown,
    "Remaining Budget": PiggyBank,
};

function GenericCard({ title, number, style, hasRadialChart, progress }: GenericCardProps) {
    const Icon = iconMap[title];
    const isPositive = !style?.includes("red");

    return (
        <>
            {hasRadialChart ? (
                <div className="w-full h-full">
                    <ProgressRadial progress={progress || 0} />
                </div>
            ) : (
                <Card className={cn(
                    "w-full h-full flex flex-col relative overflow-hidden",
                    "bg-gradient-to-br from-card to-card/80",
                    "border border-border/50",
                    "hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
                    "transition-all duration-300"
                )}>
                    {/* Decorative gradient orb */}
                    <div className={cn(
                        "absolute -top-12 -right-12 w-32 h-32 rounded-full opacity-10 blur-2xl",
                        isPositive ? "bg-primary" : "bg-destructive"
                    )} />

                    <CardContent className="p-5 flex flex-col h-full relative z-10">
                        {/* Header with icon */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                {title}
                            </span>
                            {Icon && (
                                <div className={cn(
                                    "p-2 rounded-lg",
                                    "bg-secondary/80"
                                )}>
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}
                        </div>

                        {/* Amount */}
                        <div className="flex-1 flex flex-col justify-center">
                            <div className={cn(
                                "text-3xl font-bold tracking-tight",
                                style || "text-foreground"
                            )}>
                                ${number.toLocaleString()}
                            </div>
                        </div>

                        {/* Bottom accent line */}
                        <div className={cn(
                            "h-1 w-16 rounded-full mt-4",
                            isPositive ? "bg-primary/60" : "bg-destructive/60"
                        )} />
                    </CardContent>
                </Card>
            )}
        </>
    )
}

export default GenericCard
