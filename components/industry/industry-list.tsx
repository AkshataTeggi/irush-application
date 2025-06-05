"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash2 } from "lucide-react"
import { deleteIndustry } from "@/lib/industry"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import type { Industry } from "@/types/industry"

interface IndustryListProps {
  industries: Industry[]
}

export function IndustryList({ industries }: IndustryListProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this industry?")) {
      setIsDeleting(id)
      try {
        await deleteIndustry(id)
        toast({
          title: "Industry deleted",
          description: "The industry has been deleted successfully.",
        })
        router.refresh()
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete industry. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {industries.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No industries found.
              </TableCell>
            </TableRow>
          ) : (
            industries.map((industry) => (
              <TableRow key={industry.id}>
                <TableCell className="font-medium">{industry.name}</TableCell>
                <TableCell className="max-w-xs">
                  <div className="truncate" title={industry.description || ""}>
                    {industry.description || "—"}
                  </div>
                </TableCell>
                <TableCell>
                  {industry.status}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/industries/${industry.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/industries/${industry.id}/edit`}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(industry.id)}
                    disabled={isDeleting === industry.id}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
