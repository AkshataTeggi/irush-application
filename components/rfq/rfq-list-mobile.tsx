import { CalendarDays, FileText, Settings } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { RFQ } from "@/types/rfq"

interface RfqListMobileProps {
  rfqs: RFQ[]
}

export function RfqListMobile({ rfqs }: RfqListMobileProps) {
  return (
    <div className="grid gap-4 md:hidden">
      {rfqs.map((rfq) => (
        <Card key={rfq.id}>
          <CardHeader>
            <CardTitle>{rfq.title}</CardTitle>
            <CardDescription>{rfq.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <CalendarDays className="mr-1 h-3 w-3" />
              Created at {new Date(rfq.createdAt).toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center mb-1">
                <FileText className="mr-1 h-3 w-3" />
                Files ({rfq.files.length})
              </div>
              {rfq.files.length > 0 ? (
                <div className="ml-4 space-y-1">
                  {rfq.files.slice(0, 2).map((file) => (
                    <div key={file.id} className="truncate text-xs">
                      {file.originalname}
                    </div>
                  ))}
                  {rfq.files.length > 2 && <div className="text-xs">+{rfq.files.length - 2} more</div>}
                </div>
              ) : (
                <div className="ml-4 text-xs">No files</div>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              <div className="flex items-center mb-1">
                <Settings className="mr-1 h-3 w-3" />
                Specifications ({rfq.rfqSpecifications.length})
              </div>
              {rfq.rfqSpecifications.length > 0 ? (
                <div className="ml-4 space-y-1">
                  {rfq.rfqSpecifications.slice(0, 2).map((spec, index) => (
                    <div key={index} className="truncate text-xs">
                      {spec.specification.name}: {spec.specification.value}
                    </div>
                  ))}
                  {rfq.rfqSpecifications.length > 2 && (
                    <div className="text-xs">+{rfq.rfqSpecifications.length - 2} more</div>
                  )}
                </div>
              ) : (
                <div className="ml-4 text-xs">No specifications</div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Badge
              variant="secondary"
              className={cn(
                rfq.status === "draft" && "bg-gray-100 text-gray-800",
                rfq.status === "IN_REVIEW" && "bg-blue-100 text-blue-800",
                rfq.status === "approved" && "bg-green-100 text-green-800",
                rfq.status === "rejected" && "bg-red-100 text-red-800",
                rfq.status === "completed" && "bg-purple-100 text-purple-800",
                rfq.status === "cancelled" && "bg-orange-100 text-orange-800",
              )}
            >
              {rfq.status}
            </Badge>
            <Button size="sm">View</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
