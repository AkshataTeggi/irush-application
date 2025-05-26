"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { RFQStatusBadge } from "@/components/rfq/rfq-status-badge"
import { FileText, Package, Calendar, User, Mail, Phone, MapPin, Globe, Settings, Layers } from "lucide-react"
import type { RFQ } from "@/types/rfq"

interface RFQListProps {
  rfqs: RFQ[]
  onView: (rfqId: string) => void
  onEdit: (rfqId: string) => void
  onDelete: (rfq: RFQ) => void
}

export function RFQList({ rfqs, onView, onEdit, onDelete }: RFQListProps) {
  const router = useRouter()

  if (rfqs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
        <p className="text-muted-foreground">No RFQs found</p>
      </div>
    )
  }

  const handleViewClick = (rfqId: string) => {
    router.push(`/dashboard/rfq/${rfqId}`)
  }

  const handleEditClick = (rfqId: string) => {
    router.push(`/dashboard/rfq/${rfqId}/edit`)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="rounded-md border dark:border-slate-700">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                RFQ ID
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Title & Description
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Status
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Quantity
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Customer Details
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Customer Location
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Customer Status
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Services
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Files
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Specifications
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Created Date
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Updated Date
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {rfqs.map((rfq) => (
              <tr
                key={rfq.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
              >
                {/* RFQ ID */}
                <td className="p-3 align-middle font-medium whitespace-nowrap">
                  <div className="font-mono text-xs text-muted-foreground">{rfq.id.slice(-8)}</div>
                </td>

                {/* Title & Description */}
                <td className="p-3 align-middle whitespace-nowrap max-w-[200px]">
                  <div className="truncate font-medium" title={rfq.title}>
                    {rfq.title}
                  </div>
                  <div className="text-xs text-muted-foreground truncate" title={rfq.description}>
                    {rfq.description}
                  </div>
                </td>

                {/* Status */}
                <td className="p-3 align-middle whitespace-nowrap">
                  <RFQStatusBadge status={rfq.status} />
                </td>

                {/* Quantity */}
                <td className="p-3 align-middle whitespace-nowrap">
                  <div className="flex items-center">
                    <Package className="mr-1 h-3 w-3" />
                    {rfq.quantity}
                  </div>
                </td>

                {/* Customer Details */}
                <td className="p-3 align-middle whitespace-nowrap max-w-[200px]">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <User className="mr-1 h-3 w-3" />
                      <span className="truncate font-medium" title={rfq.customer.name}>
                        {rfq.customer.name}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Mail className="mr-1 h-3 w-3" />
                      <span className="truncate" title={rfq.customer.email}>
                        {rfq.customer.email}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Phone className="mr-1 h-3 w-3" />
                      <span>{rfq.customer.phone}</span>
                    </div>
                    {rfq.customer.website && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Globe className="mr-1 h-3 w-3" />
                        <span className="truncate" title={rfq.customer.website}>
                          {rfq.customer.website.replace(/^https?:\/\//, "")}
                        </span>
                      </div>
                    )}
                  </div>
                </td>

                {/* Customer Location */}
                <td className="p-3 align-middle whitespace-nowrap max-w-[150px]">
                  <div className="space-y-1">
                    <div className="flex items-center text-xs">
                      <MapPin className="mr-1 h-3 w-3" />
                      <span className="truncate" title={rfq.customer.address}>
                        {rfq.customer.address}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rfq.customer.city}, {rfq.customer.state}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {rfq.customer.zipCode}, {rfq.customer.country}
                    </div>
                  </div>
                </td>

                {/* Customer Status */}
                <td className="p-3 align-middle whitespace-nowrap">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      rfq.customer.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {rfq.customer.status}
                  </div>
                </td>

                {/* Services */}
                <td className="p-3 align-middle whitespace-nowrap max-w-[150px]">
                  {rfq.services.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.services.slice(0, 2).map((service) => (
                        <div key={service.id} className="flex items-center text-xs">
                          <Settings className="mr-1 h-3 w-3" />
                          <span className="truncate" title={service.description}>
                            {service.name}
                          </span>
                        </div>
                      ))}
                      {rfq.services.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{rfq.services.length - 2} more</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">No services</span>
                  )}
                </td>

                {/* Files */}
                <td className="p-3 align-middle whitespace-nowrap max-w-[150px]">
                  {rfq.files.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.files.slice(0, 2).map((file) => (
                        <div key={file.id} className="space-y-1">
                          <div className="flex items-center text-xs">
                            <FileText className="mr-1 h-3 w-3" />
                            <span className="truncate" title={file.originalname}>
                              {file.originalname}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground ml-4">
                            {file.mimetype} • {formatFileSize(file.size)}
                          </div>
                        </div>
                      ))}
                      {rfq.files.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{rfq.files.length - 2} more files</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">No files</span>
                  )}
                </td>

                {/* Specifications */}
                <td className="p-3 align-middle whitespace-nowrap max-w-[200px]">
                  {rfq.rfqSpecifications.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.rfqSpecifications.slice(0, 3).map((spec, index) => (
                        <div key={index} className="flex items-center text-xs">
                          <Layers className="mr-1 h-3 w-3" />
                          <span className="truncate" title={`${spec.specification.name}: ${spec.specification.value}`}>
                            <span className="font-medium">{spec.specification.name}:</span> {spec.specification.value}
                          </span>
                        </div>
                      ))}
                      {rfq.rfqSpecifications.length > 3 && (
                        <div className="text-xs text-muted-foreground">
                          +{rfq.rfqSpecifications.length - 3} more specs
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-xs">No specifications</span>
                  )}
                </td>

                {/* Created Date */}
                <td className="p-3 align-middle text-xs whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <div>
                      <div>{new Date(rfq.createdAt).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {new Date(rfq.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Updated Date */}
                <td className="p-3 align-middle text-xs whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    <div>
                      <div>{new Date(rfq.updatedAt).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">
                        {new Date(rfq.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="p-3 align-middle whitespace-nowrap">
                  <div className="flex space-x-1">
                    <Button variant="outline" size="sm" onClick={() => handleViewClick(rfq.id)}>
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(rfq.id)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => onDelete(rfq)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
