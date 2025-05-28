"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { deleteTax } from "@/lib/tax"
import { useToast } from "@/hooks/use-toast"
import { Tax } from "@/types/ṭax"

interface TaxListMobileProps {
  taxes: Tax[]
  onRefresh: () => void
}

export function TaxListMobile({ taxes, onRefresh }: TaxListMobileProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { toast } = useToast()

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id)
      await deleteTax(id)
      toast({
        title: "Success",
        description: "Tax deleted successfully",
      })
      onRefresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete tax",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (taxes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-lg mb-4">No taxes found</p>
          <Button asChild>
            <Link href="/dashboard/tax/create">Create your first tax</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="text-sm text-muted-foreground">
        {taxes.length} tax{taxes.length !== 1 ? "es" : ""} found
      </div>
      {taxes.map((tax) => (
        <Card key={tax.id}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{tax.name}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">{tax.rate}% tax rate</p>
              </div>
              <Badge variant={tax.isActive ? "default" : "secondary"}>{tax.isActive ? "Active" : "Inactive"}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Country</p>
                <p className="text-sm">{tax.country || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">City</p>
                <p className="text-sm">{tax.city || "-"}</p>
              </div>
            </div>
            {tax.description && <p className="text-sm text-muted-foreground mb-4">{tax.description}</p>}
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/tax/${tax.id}`}>
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/tax/${tax.id}/edit`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={deletingId === tax.id}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Tax</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{tax.name}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(tax.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
