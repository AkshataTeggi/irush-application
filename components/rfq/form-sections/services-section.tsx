"use client"

import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchServices } from "@/lib/rfq-option"

interface Service {
  id: string
  name: string
  isActive: boolean
  deletedAt?: string | null
}

interface ServicesSectionProps {
  selectedServices: string[]
  onServiceToggle: (serviceId: string) => void
  disabled?: boolean
}

export function ServicesSection({ selectedServices, onServiceToggle, disabled = false }: ServicesSectionProps) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        const fetchedServices = await fetchServices()
        setServices(fetchedServices)
        setError(null)
      } catch (err) {
        console.error("Failed to load services:", err)
        setError("Failed to load services. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading services...</div>
  }

  if (error) {
    return <div className="text-sm text-destructive">{error}</div>
  }

  if (services.length === 0) {
    return <div className="text-sm text-muted-foreground">No services available</div>
  }

  return (
    <div className="space-y-4">
      <Label className="font-medium">Service Type (Check all that apply)</Label>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-center space-x-2">
            <Checkbox
              id={`service-${service.id}`}
              checked={selectedServices.includes(service.id)}
              onCheckedChange={() => onServiceToggle(service.id)}
              disabled={disabled}
            />
            <Label htmlFor={`service-${service.id}`} className="text-sm">
              {service.name}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}
