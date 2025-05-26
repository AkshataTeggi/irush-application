"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import type { CreditTerm } from "@/types/credit-term"
import { deleteCreditTerm } from "@/lib/credit-term"
import { useToast } from "@/hooks/use-toast"

interface CreditTermListProps {
  creditTerms: CreditTerm[]
  onRefresh: () => void
}

export function CreditTermList({ creditTerms, onRefresh }: CreditTermListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredCreditTerms = creditTerms.filter(
    (term) =>
      term.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (term.description && term.description.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return
    }

    setIsDeleting(id)
    try {
      await deleteCreditTerm(id)
      toast({
        title: "Success",
        description: "Credit term deleted successfully",
      })
      onRefresh()
    } catch (error) {
      console.error("Error deleting credit term:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete credit term",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card>
      
      <CardContent  className="mt-5">
        <div className="">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[200px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCreditTerms.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? "No credit terms found matching your search." : "No credit terms found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredCreditTerms.map((term) => (
                  <TableRow key={term.id}>
                    <TableCell className="font-medium">
                      <Link href={`/dashboard/credit-terms/${term.id}`} className="hover:underline">
                        {term.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{term.description || "—"}</TableCell>
                    <TableCell>{term.days} days</TableCell>
                    <TableCell>
                    
                        {term.isActive ? "Active" : "Inactive"}
                      
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(term.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/credit-terms/${term.id}`}>
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/dashboard/credit-terms/${term.id}/edit`}>
                            <Edit className="mr-1 h-4 w-4" />
                            Edit
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(term.id, term.name)}
                          disabled={isDeleting === term.id}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          {isDeleting === term.id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
