"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Edit, ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import type { CreditTerm } from "@/types/credit-term"

interface CreditTermDetailProps {
  creditTerm: CreditTerm
  onBack: () => void
}

export function CreditTermDetail({ creditTerm, onBack }: CreditTermDetailProps) {
  const isActive = creditTerm.status === "active"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{creditTerm.name}</h1>
            <p className="text-muted-foreground">Credit Term Details</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/credit-terms/${creditTerm.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Credit Term Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-sm font-medium">{creditTerm.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Payment Days</label>
              <p className="text-sm font-medium">{creditTerm.days} days</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <Badge variant={isActive ? "default" : "secondary"} className="text-sm">
                {creditTerm.status}
              </Badge>
            </div>
          </div>

          {creditTerm.description && (
            <>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-sm mt-1">{creditTerm.description}</p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm">{new Date(creditTerm.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                  <p className="text-sm">{new Date(creditTerm.updatedAt).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID</label>
                <p className="text-sm font-mono">{creditTerm.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
