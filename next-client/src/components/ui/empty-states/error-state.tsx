import { AlertTriangle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  title?: string;
  retryText?: string;
  className?: string;
}

export function ErrorState({ 
  error, 
  onRetry, 
  title = "Something went wrong",
  retryText = "Try again",
  className = ""
}: ErrorStateProps) {
  return (
    <Card className={`flex flex-col items-center justify-center p-6 text-center ${className}`}>
      <div className="relative">
        <AlertTriangle className="h-16 w-16 text-red-500 mb-4 mx-auto" />
        <AlertCircle className="absolute -right-1 -bottom-1 h-6 w-6 text-red-600 bg-background rounded-full" />
      </div>
      <h3 className="text-lg font-medium text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-md">
        {error}
      </p>
      {onRetry && (
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="gap-2"
        >
          <Loader2 className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          {retryText}
        </Button>
      )}
    </Card>
  );
}
