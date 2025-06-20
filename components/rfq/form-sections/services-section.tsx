"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Wrench, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Service {
  id: string
  name: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

interface ServicesSectionProps {
  services: Service[]
  selectedServices: string[]
  onServiceToggle: (serviceId: string) => void
  disabled?: boolean
  isLoading?: boolean
  error?: string | null
}

export function ServicesSection({
  services,
  selectedServices,
  onServiceToggle,
  disabled = false,
  isLoading = false,
  error = null,
}: ServicesSectionProps) {
  // Handle checkbox change to prevent infinite loops
  const handleCheckboxChange = (serviceId: string, checked: boolean) => {
    if (disabled) return

    // Only call onServiceToggle if the state actually needs to change
    const isCurrentlySelected = selectedServices.includes(serviceId)
    if (checked !== isCurrentlySelected) {
      onServiceToggle(serviceId)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 animate-pulse">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
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
            <Wrench className="h-5 w-5" />
            Services
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

  const activeServices = services.filter((service) => service.isActive && !service.deletedAt)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Services
          {selectedServices.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {selectedServices.length} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activeServices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Wrench className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No services available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeServices.map((service) => {
              const isSelected = selectedServices.includes(service.id)

              return (
                <div
                  key={service.id}
                  className={`flex items-start space-x-3 p-3 rounded-lg border transition-colors ${
                    isSelected
                      ? "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <Checkbox
                    id={`service-${service.id}`}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleCheckboxChange(service.id, checked === true)}
                    disabled={disabled}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <label
                      htmlFor={`service-${service.id}`}
                      className={`block text-sm font-medium ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                      onClick={() => !disabled && handleCheckboxChange(service.id, !isSelected)}
                    >
                      {service.name}
                    </label>
                    {service.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{service.description}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
