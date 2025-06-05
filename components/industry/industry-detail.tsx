"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Info, Pencil } from "lucide-react"
import type { Industry } from "@/types/industry"
import { Label } from "@radix-ui/react-label"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

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
            <Link href={`/dashboard/industries/${industry.id}/edit`}>
             <Pencil className="mr-2 h-4 w-4" />
             Edit</Link>
          </Button>
          <Button variant="outline" onClick={onBack}>
             <ArrowLeft className="mr-2 h-4 w-4" />
            Back 
          </Button>
        </div>
      </div>



      <Card>
  <CardContent className="space-y-6 mt-5">

    {/* ID - Full width */}
    <div className="space-y-2">
      <Label>ID</Label>
      <Input value={industry.id} disabled className="font-mono" />
    </div>

    {/* Name & Status - Two Columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={industry.name} disabled />
      </div>
      <div className="space-y-2">
        <Label>Status</Label>
        <Input
          value={industry.status}
          disabled
          className={industry.status === "active" ? "text-green-600" : "text-muted-foreground"}
        />
      </div>
    </div>

    {/* Description */}
    {industry.description && (
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={industry.description} rows={3} disabled />
      </div>
    )}

    {/* Created & Updated Timestamps */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Created</Label>
        <Input value={new Date(industry.createdAt).toLocaleString()} disabled />
      </div>
      <div className="space-y-2">
        <Label>Updated</Label>
        <Input value={new Date(industry.updatedAt).toLocaleString()} disabled />
      </div>
    </div>

  </CardContent>
</Card>

    </div>
  )
}
