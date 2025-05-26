"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import type { CreditTerm } from "@/types/credit-term"
import { deleteCreditTerm } from "@/lib/credit-term"
import { useToast } from "@/hooks/use-toast"

interface CreditTermListMobileProps {
  creditTerms: CreditTerm[]
  onRefresh: () => void
}

export function CreditTermListMobile({ creditTerms, onRefresh }: CreditTermListMobileProps) {
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
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Credit Terms</CardTitle>
              <CardDescription>
                {filteredCreditTerms.length} of {creditTerms.length} credit terms
              </CardDescription>
            </div>
            <Button onClick={onRefresh} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search credit terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {filteredCreditTerms.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            {searchQuery ? "No credit terms found matching your search." : "No credit terms found."}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredCreditTerms.map((term) => (
            <Card key={term.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/dashboard/credit-terms/${term.id}`}
                      className="font-medium hover:underline block truncate"
                    >
                      {term.name}
                    </Link>
                    {term.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{term.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={term.isActive ? "default" : "secondary"} className="text-xs">
                        {term.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{term.days} days</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(term.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
