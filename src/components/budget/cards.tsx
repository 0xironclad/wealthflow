import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ProgressRadial } from "./progress-radial";


interface GenericCardProps {
    title: string;
    number: number;
    style?: string;
    hasRadialChart?: boolean;
    progress?: number;
}


function GenericCard({ title, number, style, hasRadialChart, progress }: GenericCardProps) {
    return (
        <>
            {
                hasRadialChart ? (
                    <div className="w-full h-full">
                        <ProgressRadial progress={progress || 0} />
                    </div>
                ) : (
                    <Card className={cn("w-full h-full flex flex-col")}>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm">{title}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 flex-1 flex items-start">
                            <div className={cn("text-xl font-semibold", style)}>$ {number.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                )
            }
        </>
    )
}

export default GenericCard
