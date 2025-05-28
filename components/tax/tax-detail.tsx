"use client"

import type React from "react"

import Link from "next/link"
import { ArrowLeft, Edit, Calendar, Hash, Percent, MapPin, Globe, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tax } from "@/types/ṭax"

interface TaxDetailProps {
  tax: Tax
  onBack: () => void
}

export const TaxDetail: React.FC<TaxDetailProps> = ({ tax, onBack }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">TAX Details</h1>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href={`/dashboard/tax/${tax.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Tax
            </Link>
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Taxes
          </Button>
        </div>
      </div>

      {/* Tax Information Card */}
      <Card>
       
        <CardContent className="space-y-6 mt-5">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tax Name</label>
              <p >{tax.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Tax Rate</label>
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4 text-muted-foreground" />
                <p>{tax.rate}%</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="mt-1">
                {tax.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </div>

          {/* Location Information */}
       
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Country</label>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <p>{tax.country || "Not specified"}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">County/State</label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p>{tax.county || "Not specified"}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">City</label>
              <div className="flex items-center gap-2 mt-1">
                <Building className="h-4 w-4 text-muted-foreground" />
                <p>{tax.city || "Not specified"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          {tax.description && (
            <>
          
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-sm leading-relaxed">{tax.description}</p>
              </div>
            </>
          )}

          {/* System Information */}
          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Created</p>
                <p className="text-muted-foreground">{new Date(tax.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Last Updated</p>
                <p className="text-muted-foreground">{new Date(tax.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">Tax ID</p>
                <p className="text-muted-foreground font-mono text-xs">{tax.id}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
