"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { Specification } from "@/lib/rfq-option"

interface SpecificationValue {
  specificationId: string
  value: string
  unit?: string
}

interface SpecificationsSectionProps {
  specifications: Specification[]
  specificationValues: SpecificationValue[]
  onSpecificationChange: (specId: string, value: string | number | boolean) => void
  disabled?: boolean
}

export function SpecificationsSection({
  specifications,
  specificationValues,
  onSpecificationChange,
  disabled = false,
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
            <SelectTrigger>
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
          />
        )
    }
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="specifications">
        <AccordionTrigger className="font-medium">Add Board Specifications (optional)</AccordionTrigger>
        <AccordionContent>
          {specifications.length > 0 ? (
            <div className="space-y-6">
              {/* Non-Checkbox Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specifications
                  .filter((spec) => (spec.type || "TEXT") !== "CHECKBOX")
                  .map((spec) => (
                    <div key={spec.id} className="bg-white p-3 rounded-md shadow-sm border">
                      <Label className="font-medium text-sm mb-2 block">
                        {spec.name}
                        {spec.isRequired && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderSpecificationInput(spec)}
                    </div>
                  ))}
              </div>

              {/* Checkbox Specifications */}
              {specifications.filter((spec) => (spec.type || "TEXT") === "CHECKBOX").length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Additional Options</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specifications
                      .filter((spec) => (spec.type || "TEXT") === "CHECKBOX")
                      .map((spec) => (
                        <div key={spec.id} className="bg-white p-3 rounded-md shadow-sm border">
                          {renderSpecificationInput(spec)}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 py-2">No specifications available</p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
