"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RFQStatusBadge } from "@/components/rfq/rfq-status-badge"
import {
  Edit,
  FileText,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Settings,
  Download,
} from "lucide-react"
import type { RFQ } from "@/types/rfq"

interface RFQDetailProps {
  rfq: RFQ
  onBack: () => void
  onEdit: () => void
}

export function RFQDetail({ rfq, onBack, onEdit }: RFQDetailProps) {
  const handleFileDownload = (file: any) => {
    // In a real implementation, this would handle file download
    console.log("Download file:", file)
    // You could implement actual file download logic here
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">RFQ Details</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={onBack}>
            Back to RFQs
          </Button>
          <Button onClick={onEdit}>
            <Edit className="mr-1 h-4 w-4" /> Edit RFQ
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="mt-5 space-y-6">
          {/* RFQ Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">RFQ Information</h3>
              <RFQStatusBadge status={rfq.status} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">RFQ ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{rfq.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Title</h4>
                <p className="text-sm text-muted-foreground">{rfq.title}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Quantity</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Package className="mr-1 h-3 w-3" />
                  {rfq.quantity}
                </div>
              </div>
              <div className="md:col-span-2 lg:col-span-3">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-muted-foreground">{rfq.description}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Created At</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(rfq.createdAt).toLocaleString()}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Updated At</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(rfq.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium">Customer ID</h4>
                <p className="text-sm text-muted-foreground font-mono break-all">{rfq.customer.id}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Name</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-1 h-3 w-3" />
                  {rfq.customer.name}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Email</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-1 h-3 w-3" />
                  {rfq.customer.email}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Phone</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-1 h-3 w-3" />
                  {rfq.customer.phone}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Industry</h4>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Building className="mr-1 h-3 w-3" />
                  {rfq.customer.industryType?.name || "Not specified"}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Status</h4>
                <Badge
                  className={
                    rfq.customer.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
                  }
                >
                  {rfq.customer.status}
                </Badge>
              </div>
              {rfq.customer.address && (
                <div className="md:col-span-2 lg:col-span-3">
                  <h4 className="text-sm font-medium">Address</h4>
                  <div className="flex items-start text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-3 w-3 mt-0.5" />
                    <div>
                      <div>{rfq.customer.address}</div>
                      <div>
                        {rfq.customer.city}, {rfq.customer.state} {rfq.customer.zipCode}
                      </div>
                      <div>{rfq.customer.country}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Services Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Services</h3>
            {rfq.services.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {rfq.services.map((service) => (
                  <div key={service.id} className="rounded-md border p-4 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium flex items-center">
                          <Settings className="mr-1 h-4 w-4" />
                          {service.name}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      </div>
                      <Badge variant={service.isActive ? "default" : "secondary"}>
                        {service.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Created: {new Date(service.createdAt).toLocaleDateString()}</p>
                      <p>Updated: {new Date(service.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No services associated with this RFQ</p>
              </div>
            )}
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Files Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Attached Files</h3>
            {rfq.files.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {rfq.files.map((file) => (
                  <div key={file.id} className="rounded-md border p-4 dark:border-slate-700">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium flex items-center">
                          <FileText className="mr-1 h-4 w-4" />
                          {file.originalname}
                        </h4>
                        <p className="text-sm text-muted-foreground">System: {file.filename}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.mimetype} • {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleFileDownload(file)} className="ml-2">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <p>Version: {file.version}</p>
                      <p>Storage: {file.storageType}</p>
                      <p>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No files attached to this RFQ</p>
              </div>
            )}
          </div>

          <Separator className="dark:bg-slate-700" />

          {/* Specifications Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Specifications</h3>
            {rfq.rfqSpecifications.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {rfq.rfqSpecifications.map((spec, index) => (
                  <div key={spec.specification.id || index} className="rounded-md border p-3 dark:border-slate-700">
                    <h4 className="font-medium text-sm">{spec.specification.name}</h4>
                    <p className="text-sm text-muted-foreground">{spec.specification.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-20 bg-muted rounded-lg dark:bg-slate-800">
                <p className="text-muted-foreground">No specifications defined for this RFQ</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
