"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Info } from "lucide-react"
import type { Industry } from "@/types/industry"

interface IndustryDetailProps {
  industry: Industry
  onBack: () => void
}

export function IndustryDetail({ industry, onBack }: IndustryDetailProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Industry Details</h1>
        <div className="flex space-x-4">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/industries/${industry.id}/edit`}>Edit Industry</Link>
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back to Industries
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Industry Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-base">{industry.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
              <Badge variant={industry.status === "active" ? "default" : "secondary"}>{industry.status}</Badge>
            </div>
          </div>

          {industry.description && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-base">{industry.description}</p>
              </div>
            </>
          )}

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">{new Date(industry.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Updated</p>
                  <p className="text-sm text-muted-foreground">{new Date(industry.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center mt-2">
              <Info className="h-4 w-4 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">ID</p>
                <p className="text-sm text-muted-foreground">{industry.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
