import { Card, CardContent } from "./ui/card";

export function JobCardSkeleton() {
  return (
    <Card className="bg-white border border-neutral-200">
      <CardContent className="p-6">
        {/* Header section with title and company */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="h-5 w-3/4 animate-shimmer rounded mb-2"></div>
            <div className="h-4 w-1/2 animate-shimmer rounded"></div>
          </div>
          <div className="h-10 w-10 animate-shimmer rounded-full"></div>
        </div>

        {/* Location, salary, facility type */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center">
            <div className="h-4 w-4 animate-shimmer rounded mr-1"></div>
            <div className="h-4 w-20 animate-shimmer rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 animate-shimmer rounded mr-1"></div>
            <div className="h-4 w-24 animate-shimmer rounded"></div>
          </div>
          <div className="flex items-center">
            <div className="h-4 w-4 animate-shimmer rounded mr-1"></div>
            <div className="h-4 w-16 animate-shimmer rounded"></div>
          </div>
        </div>

        {/* Highlights badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 w-24 animate-shimmer rounded-full"></div>
          <div className="h-6 w-20 animate-shimmer rounded-full"></div>
          <div className="h-6 w-28 animate-shimmer rounded-full"></div>
          <div className="h-6 w-22 animate-shimmer rounded-full"></div>
        </div>

        {/* Footer with posted date and apply button */}
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="h-4 w-4 animate-shimmer rounded mr-1"></div>
            <div className="h-4 w-16 animate-shimmer rounded"></div>
          </div>
          <div className="h-9 w-24 animate-shimmer rounded"></div>
        </div>
      </CardContent>
    </Card>
  );
}