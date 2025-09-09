import { Card, CardContent, CardTitle, CardDescription, CardHeader } from './ui/card'
import { Loader2 } from 'lucide-react'

function LoadingComponent() {
    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle>Money spent</CardTitle>
                <CardDescription>Loading data...</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-[200px]">
                <Loader2 className="animate-spin rounded-full h-8 w-8 text-primary" />
            </CardContent>
        </Card>
    )
}

export default LoadingComponent