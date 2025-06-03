"use client"
import { useState } from "react"
import Link from "next/link"
import { Eye, Edit, Trash2, User, Calendar, Package, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { deleteRfq } from "@/lib/rfq"
import type { RFQ } from "@/types/rfq"

interface RfqListMobileProps {
  rfqs: RFQ[]
  onRfqDeleted: () => void
}

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "draft":
      return "secondary"
    case "pending":
      return "default"
    case "approved":
      return "default"
    case "rejected":
      return "destructive"
    default:
      return "secondary"
  }
}

const getPriorityBadgeVariant = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "low":
      return "secondary"
    case "medium":
      return "default"
    case "high":
      return "default"
    case "urgent":
      return "destructive"
    default:
      return "secondary"
  }
}

export function RfqListMobile({ rfqs, onRfqDeleted }: RfqListMobileProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this RFQ?")) return

    setDeletingId(id)
    try {
      await deleteRfq(id)
      toast({
        title: "Success",
        description: "RFQ deleted successfully",
      })
      onRfqDeleted()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete RFQ",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  // Helper function to get key specifications for display
  const getKeySpecifications = (rfq: RFQ) => {
    if (!rfq.specifications || rfq.specifications.length === 0) {
      return null
    }

    // Look for important specifications to display (limit to 3 for mobile)
    const keySpecs = ["Layers", "Board Size", "Material"]

    const foundSpecs: Record<string, string> = {}

    keySpecs.forEach((key) => {
      const spec = rfq.specifications?.find((s) => s.key === key || s.key.toLowerCase() === key.toLowerCase())
      if (spec) {
        foundSpecs[spec.key] = spec.value
      }
    })

    return Object.keys(foundSpecs).length > 0 ? foundSpecs : null
  }

  if (rfqs.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No RFQs found</div>
  }

  return (
    <div className="space-y-4">
      {rfqs.map((rfq) => {
        const keySpecs = getKeySpecifications(rfq)

        return (
          <Card key={rfq.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Link href={`/dashboard/rfq/${rfq.id}`} className="font-semibold hover:underline">
                    {rfq.title}
                  </Link>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(rfq.status)}>{rfq.status}</Badge>
                    <Badge variant={getPriorityBadgeVariant(rfq.priority)}>{rfq.priority}</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{rfq.customer?.name || "No customer"}</span>
                </div>

                {keySpecs && (
                  <div className="border-t border-b py-2 my-2">
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-0.5" />
                      <div className="space-y-1">
                        {Object.entries(keySpecs).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 gap-1">
                            <span className="text-xs font-medium">{key}:</span>
                            <span className="text-xs">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{rfq.services?.length || 0} service(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(rfq.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/rfq/${rfq.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/dashboard/rfq/${rfq.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(rfq.id)}
                  disabled={deletingId === rfq.id}
                  className="flex-1"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
