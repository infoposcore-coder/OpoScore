import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TutorLoading() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>

      <div className="max-w-3xl">
        <Card>
          <CardHeader className="pb-3 border-b">
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] p-4 space-y-4">
              <div className="flex justify-start">
                <Skeleton className="h-16 w-3/4 rounded-lg" />
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-1/2 rounded-lg" />
              </div>
              <div className="flex justify-start">
                <Skeleton className="h-24 w-3/4 rounded-lg" />
              </div>
            </div>
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
