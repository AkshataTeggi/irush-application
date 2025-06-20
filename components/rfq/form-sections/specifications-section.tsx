"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Settings, AlertCircle, FileSpreadsheet } from "lucide-react"
import type { Specification } from "@/lib/rfq-option"
import { ExcelFileUpload } from "@/components/rfq/excel-file-upload"

interface SpecificationValue {
  specificationId: string
  value: string
  allowedUnits?: string[]
}

interface SpecificationsSectionProps {
  specifications: Specification[]
  specificationValues: SpecificationValue[]
  onSpecificationChange: (specId: string, value: string | number | boolean) => void
  disabled?: boolean
  isLoading?: boolean
  error?: string | null
  rfqId?: string // For Excel upload
}

interface ExtractedSpec {
  key: string
  value: any
  specificationId?: string
}

interface ExcelProcessingResult {
  message: string
  extractedSpecs: ExtractedSpec[]
  extractedAssembly?: any[]
  extractedImages?: string[]
}

export function SpecificationsSection({
  specifications,
  specificationValues,
  onSpecificationChange,
  disabled = false,
  isLoading = false,
  error = null,
  rfqId = "temp-rfq", // Default temp ID for Excel upload
}: SpecificationsSectionProps) {
  // Render specification input
  const renderSpecificationInput = (spec: Specification) => {
    const currentValue = specificationValues.find((s) => s.specificationId === spec.id)?.value || ""

    switch (spec.type || "TEXT") {
      case "TEXT":
        return (
          <Input
            value={currentValue}
            onChange={(e) => onSpecificationChange(spec.id, e.target.value)}
            placeholder={`Enter ${spec.name}`}
            disabled={disabled}
            className="w-full"
          />
        )

      case "SELECT":
      case "DROPDOWN":
        const options = spec.suggestions || []
        return (
          <Select
            value={currentValue || ""}
            onValueChange={(value) => onSpecificationChange(spec.id, value)}
            disabled={disabled}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={`Select ${spec.name}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "CHECKBOX":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={currentValue === "true"}
              onCheckedChange={(checked) => onSpecificationChange(spec.id, checked)}
              disabled={disabled}
            />
            <Label className="text-sm">{spec.name}</Label>
          </div>
        )

      default:
        return (
          <Input
            value={currentValue}
            onChange={(e) => onSpecificationChange(spec.id, e.target.value)}
            placeholder={`Enter ${spec.name}`}
            disabled={disabled}
            className="w-full"
          />
        )
    }
  }

  // Handle Excel upload success
  const handleExcelUploadSuccess = (result: ExcelProcessingResult) => {
    console.log("Excel processing completed:", result)

    // Auto-fill matching specifications
    if (result.extractedSpecs && result.extractedSpecs.length > 0) {
      result.extractedSpecs.forEach((extractedSpec) => {
        // Try to match with existing specifications by name
        const matchingSpec = specifications.find(
          (spec) =>
            spec.name.toLowerCase().includes(extractedSpec.key.toLowerCase()) ||
            extractedSpec.key.toLowerCase().includes(spec.name.toLowerCase()) ||
            spec.name.toLowerCase() === extractedSpec.key.toLowerCase(),
        )

        if (matchingSpec) {
          console.log(`Auto-filling specification: ${matchingSpec.name} = ${extractedSpec.value}`)
          onSpecificationChange(matchingSpec.id, extractedSpec.value)
        }
      })
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Board Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Board Specifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const activeSpecifications = specifications.filter((spec) => spec.isActive && !spec.isDeleted)
  const filledSpecifications = specificationValues.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Board Specifications
          {filledSpecifications > 0 && (
            <Badge variant="secondary" className="ml-2">
              {filledSpecifications} filled
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Excel Import Section - Using the same component as RFQ details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            <h3 className="text-lg font-medium">Import from Excel</h3>
          </div>

          <ExcelFileUpload rfqId={rfqId} onUploadSuccess={handleExcelUploadSuccess} />
        </div>

        <Separator />

        {/* Manual Specifications Entry */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Manual Entry</h3>
          {activeSpecifications.length > 0 ? (
            <div className="space-y-6">
              {/* Non-Checkbox Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeSpecifications
                  .filter((spec) => (spec.type || "TEXT") !== "CHECKBOX")
                  .map((spec) => (
                    <div key={spec.id} className="space-y-2">
                      <Label className="font-medium text-sm">
                        {spec.name}
                        {spec.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderSpecificationInput(spec)}
                      {spec.description && <p className="text-xs text-gray-500">{spec.description}</p>}
                    </div>
                  ))}
              </div>

              {/* Checkbox Specifications */}
              {activeSpecifications.filter((spec) => (spec.type || "TEXT") === "CHECKBOX").length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Additional Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeSpecifications
                      .filter((spec) => (spec.type || "TEXT") === "CHECKBOX")
                      .map((spec) => (
                        <div key={spec.id} className="space-y-2">
                          {renderSpecificationInput(spec)}
                          {spec.description && <p className="text-xs text-gray-500 ml-6">{spec.description}</p>}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No specifications available for manual entry</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
