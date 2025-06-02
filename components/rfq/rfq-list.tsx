// "use client"

// import { Button } from "@/components/ui/button"
// import { useRouter } from "next/navigation"
// import { RFQStatusBadge } from "@/components/rfq/rfq-status-badge"
// import type { RFQ } from "@/types/rfq"

// interface RFQListProps {
//   rfqs: RFQ[]
//   onView: (rfqId: string) => void
//   onEdit: (rfqId: string) => void
//   onDelete: (rfq: RFQ) => void
// }

// export function RFQList({ rfqs, onView, onEdit, onDelete }: RFQListProps) {
//   const router = useRouter()

//   if (rfqs.length === 0) {
//     return (
//       <div className="flex items-center justify-center h-32 bg-muted rounded-lg dark:bg-slate-800">
//         <p className="text-muted-foreground">No RFQs found</p>
//       </div>
//     )
//   }

//   const handleViewClick = (rfqId: string) => {
//     router.push(`/dashboard/rfq/${rfqId}`)
//   }

//   const handleEditClick = (rfqId: string) => {
//     router.push(`/dashboard/rfq/${rfqId}/edit`)
//   }

//   return (
//     <div className="rounded-md border dark:border-slate-700">
//       <div className="relative w-full overflow-auto">
//         <table className="w-full caption-bottom text-sm table-fixed">
//           <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
//             <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-24">RFQ ID</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Title</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">Description</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Status</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-24">Quantity</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Customer ID</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Customer Name</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">
//                 Customer Email
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
//                 Customer Phone
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">
//                 Customer Address
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">Customer City</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
//                 Customer State
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
//                 Customer Zip Code
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
//                 Customer Country
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">
//                 Customer Website
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
//                 Customer Status
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Salesman ID</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
//                 Credit Term ID
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Tax ID</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Industry ID</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Files</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Services</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">RFQ Assembly</th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">
//                 RFQ Specifications
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
//                 RFQ Created At
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
//                 RFQ Updated At
//               </th>
//               <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="[&_tr:last-child]:border-0">
//             {rfqs.map((rfq) => (
//               <tr
//                 key={rfq.id}
//                 className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
//               >
//                 {/* RFQ ID */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.id}>
//                     {rfq.id.slice(-8)}
//                   </span>
//                 </td>

//                 {/* Title */}
//                 <td className="p-3 align-middle">
//                   <div className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.title}>
//                     {rfq.title}
//                   </div>
//                 </td>

//                 {/* Description */}
//                 <td className="p-3 align-middle">
//                   <div className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.description}>
//                     {rfq.description}
//                   </div>
//                 </td>

//                 {/* Status */}
//                 <td className="p-3 align-middle">
//                   <RFQStatusBadge status={rfq.status} />
//                 </td>

//                 {/* Quantity */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.quantity}</span>
//                 </td>

//                 {/* Customer ID */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customerId}>
//                     {rfq.customerId.slice(-8)}
//                   </span>
//                 </td>

//                 {/* Customer Name */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.name}>
//                     {rfq.customer.name}
//                   </span>
//                 </td>

//                 {/* Customer Email */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.email}>
//                     {rfq.customer.email}
//                   </span>
//                 </td>

//                 {/* Customer Phone */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.phone}</span>
//                 </td>

//                 {/* Customer Address */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.address}>
//                     {rfq.customer.address}
//                   </span>
//                 </td>

//                 {/* Customer City */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.city}</span>
//                 </td>

//                 {/* Customer State */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.state}</span>
//                 </td>

//                 {/* Customer Zip Code */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.zipCode}</span>
//                 </td>

//                 {/* Customer Country */}
//                 <td className="p-3 align-middle">
//                   <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.country}</span>
//                 </td>

//                 {/* Customer Website */}
//                 <td className="p-3 align-middle">
//                   {rfq.customer.website ? (
//                     <span
//                       className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                       title={rfq.customer.website}
//                     >
//                       {rfq.customer.website.replace(/^https?:\/\//, "")}
//                     </span>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No website</span>
//                   )}
//                 </td>

//                 {/* Customer Status */}
//                 <td className="p-3 align-middle">
//                   <div
//                     className={`inline-flex items-center px-2 py-1 rounded-full ${
//                       rfq.customer.status === "active"
//                         ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
//                         : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
//                     }`}
//                   >
//                     {rfq.customer.status}
//                   </div>
//                 </td>

//                 {/* Salesman ID */}
//                 <td className="p-3 align-middle">
//                   {rfq.customer.salesmanId ? (
//                     <span
//                       className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                       title={rfq.customer.salesmanId}
//                     >
//                       {rfq.customer.salesmanId.slice(-8)}
//                     </span>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No salesman</span>
//                   )}
//                 </td>

//                 {/* Credit Term ID */}
//                 <td className="p-3 align-middle">
//                   {rfq.customer.creditTermId ? (
//                     <span
//                       className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                       title={rfq.customer.creditTermId}
//                     >
//                       {rfq.customer.creditTermId.slice(-8)}
//                     </span>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No credit term</span>
//                   )}
//                 </td>

//                 {/* Tax ID */}
//                 <td className="p-3 align-middle">
//                   {rfq.customer.taxId ? (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.taxId}>
//                       {rfq.customer.taxId.slice(-8)}
//                     </span>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No tax ID</span>
//                   )}
//                 </td>

//                 {/* Industry ID */}
//                 <td className="p-3 align-middle">
//                   {rfq.customer.industryId ? (
//                     <span
//                       className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                       title={rfq.customer.industryId}
//                     >
//                       {rfq.customer.industryId.slice(-8)}
//                     </span>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No industry</span>
//                   )}
//                 </td>

//                 {/* Files */}
//                 <td className="p-3 align-middle">
//                   {rfq.files.length > 0 ? (
//                     <div className="space-y-1">
//                       {rfq.files.slice(0, 2).map((file) => (
//                         <div
//                           key={file.id}
//                           className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                           title={file.originalname}
//                         >
//                           {file.originalname}
//                         </div>
//                       ))}
//                       {rfq.files.length > 2 && (
//                         <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                           +{rfq.files.length - 2} more files
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No files</span>
//                   )}
//                 </td>

//                 {/* Services */}
//                 <td className="p-3 align-middle">
//                   {rfq.services.length > 0 ? (
//                     <div className="space-y-1">
//                       {rfq.services.slice(0, 2).map((service) => (
//                         <div
//                           key={service.id}
//                           className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                           title={service.name}
//                         >
//                           {service.name}
//                         </div>
//                       ))}
//                       {rfq.services.length > 2 && (
//                         <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                           +{rfq.services.length - 2} more services
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No services</span>
//                   )}
//                 </td>

//                 {/* RFQ Assembly */}
//                 <td className="p-3 align-middle">
//                   {rfq.rfqAssembly && rfq.rfqAssembly.length > 0 ? (
//                     <div className="space-y-1">
//                       {rfq.rfqAssembly.slice(0, 2).map((assembly, index) => (
//                         <div key={index} className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                           Assembly {index + 1}
//                         </div>
//                       ))}
//                       {rfq.rfqAssembly.length > 2 && (
//                         <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                           +{rfq.rfqAssembly.length - 2} more assemblies
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No assemblies</span>
//                   )}
//                 </td>

//                 {/* RFQ Specifications */}
//                 <td className="p-3 align-middle">
//                   {rfq.rfqSpecifications.length > 0 ? (
//                     <div className="space-y-1">
//                       {rfq.rfqSpecifications.slice(0, 3).map((spec, index) => (
//                         <div
//                           key={index}
//                           className="block overflow-hidden text-ellipsis whitespace-nowrap"
//                           title={`${spec.specification.name}: ${spec.specification.value}`}
//                         >
//                           {spec.specification.name}: {spec.specification.value}
//                         </div>
//                       ))}
//                       {rfq.rfqSpecifications.length > 3 && (
//                         <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                           +{rfq.rfqSpecifications.length - 3} more specs
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No specifications</span>
//                   )}
//                 </td>

//                 {/* RFQ Created At */}
//                 <td className="p-3 align-middle">
//                   <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                     {new Date(rfq.createdAt).toLocaleDateString()}
//                   </div>
//                 </td>

//                 {/* RFQ Updated At */}
//                 <td className="p-3 align-middle">
//                   <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
//                     {new Date(rfq.updatedAt).toLocaleDateString()}
//                   </div>
//                 </td>

//                 {/* Actions */}
//                 <td className="p-3 align-middle">
//                   <div className="flex space-x-1">
//                     <Button variant="outline" size="sm" onClick={() => handleViewClick(rfq.id)}>
//                       View
//                     </Button>
//                     <Button variant="outline" size="sm" onClick={() => handleEditClick(rfq.id)}>
//                       Edit
//                     </Button>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
//                       onClick={() => onDelete(rfq)}
//                     >
//                       Delete
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }
















"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { RFQStatusBadge } from "@/components/rfq/rfq-status-badge"
import type { RFQ } from "@/types/rfq"
import { useMediaQuery } from "@/hooks/use-media-query"
import { CalendarDays, FileText, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface RFQListProps {
  rfqs: RFQ[]
  onView: (rfqId: string) => void
  onEdit: (rfqId: string) => void
  onDelete: (rfq: RFQ) => void
}

export function RFQList({ rfqs, onView, onEdit, onDelete }: RFQListProps) {
  const router = useRouter()
  const isDesktop = useMediaQuery("(min-width: 768px)")

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

  // Mobile view
  if (!isDesktop) {
    return (
      <div className="grid gap-4">
        {rfqs.map((rfq) => (
          <Card key={rfq.id}>
            <CardHeader>
              <CardTitle>{rfq.title}</CardTitle>
              <CardDescription>{rfq.description}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="mr-1 h-3 w-3" />
                Created at {new Date(rfq.createdAt).toLocaleDateString()}
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center mb-1">
                  <FileText className="mr-1 h-3 w-3" />
                  Files ({rfq.files.length})
                </div>
                {rfq.files.length > 0 ? (
                  <div className="ml-4 space-y-1">
                    {rfq.files.slice(0, 2).map((file) => (
                      <div key={file.id} className="truncate text-xs">
                        {file.originalname}
                      </div>
                    ))}
                    {rfq.files.length > 2 && <div className="text-xs">+{rfq.files.length - 2} more</div>}
                  </div>
                ) : (
                  <div className="ml-4 text-xs">No files</div>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <div className="flex items-center mb-1">
                  <Settings className="mr-1 h-3 w-3" />
                  Specifications ({rfq.rfqSpecifications.length})
                </div>
                {rfq.rfqSpecifications.length > 0 ? (
                  <div className="ml-4 space-y-1">
                    {rfq.rfqSpecifications.slice(0, 2).map((spec, index) => (
                      <div key={index} className="truncate text-xs">
                        {spec.specification.name}: {spec.specification.value}
                      </div>
                    ))}
                    {rfq.rfqSpecifications.length > 2 && (
                      <div className="text-xs">+{rfq.rfqSpecifications.length - 2} more</div>
                    )}
                  </div>
                ) : (
                  <div className="ml-4 text-xs">No specifications</div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <RFQStatusBadge status={rfq.status} />
              <div className="flex space-x-1">
                <Button size="sm" onClick={() => handleViewClick(rfq.id)}>
                  View
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleEditClick(rfq.id)}>
                  Edit
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  // Desktop view - keep the existing table view
  return (
    <div className="rounded-md border dark:border-slate-700">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm table-fixed">
          <thead className="[&_tr]:border-b dark:[&_tr]:border-slate-700">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700">
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-24">RFQ ID</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Title</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">Description</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Status</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-24">Quantity</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Customer ID</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Customer Name</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">
                Customer Email
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
                Customer Phone
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">
                Customer Address
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">Customer City</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
                Customer State
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
                Customer Zip Code
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
                Customer Country
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">
                Customer Website
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
                Customer Status
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Salesman ID</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">
                Credit Term ID
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Tax ID</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-28">Industry ID</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Files</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">Services</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-40">RFQ Assembly</th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-48">
                RFQ Specifications
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
                RFQ Created At
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">
                RFQ Updated At
              </th>
              <th className="h-12 px-3 text-left align-middle font-medium text-muted-foreground w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {rfqs.map((rfq) => (
              <tr
                key={rfq.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted dark:border-slate-700"
              >
                {/* RFQ ID */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.id}>
                    {rfq.id.slice(-8)}
                  </span>
                </td>

                {/* Title */}
                <td className="p-3 align-middle">
                  <div className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.title}>
                    {rfq.title}
                  </div>
                </td>

                {/* Description */}
                <td className="p-3 align-middle">
                  <div className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.description}>
                    {rfq.description}
                  </div>
                </td>

                {/* Status */}
                <td className="p-3 align-middle">
                  <RFQStatusBadge status={rfq.status} />
                </td>

                {/* Quantity */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.quantity}</span>
                </td>

                {/* Customer ID */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customerId}>
                    {rfq.customerId.slice(-8)}
                  </span>
                </td>

                {/* Customer Name */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.name}>
                    {rfq.customer.name}
                  </span>
                </td>

                {/* Customer Email */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.email}>
                    {rfq.customer.email}
                  </span>
                </td>

                {/* Customer Phone */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.phone}</span>
                </td>

                {/* Customer Address */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.address}>
                    {rfq.customer.address}
                  </span>
                </td>

                {/* Customer City */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.city}</span>
                </td>

                {/* Customer State */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.state}</span>
                </td>

                {/* Customer Zip Code */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.zipCode}</span>
                </td>

                {/* Customer Country */}
                <td className="p-3 align-middle">
                  <span className="block overflow-hidden text-ellipsis whitespace-nowrap">{rfq.customer.country}</span>
                </td>

                {/* Customer Website */}
                <td className="p-3 align-middle">
                  {rfq.customer.website ? (
                    <span
                      className="block overflow-hidden text-ellipsis whitespace-nowrap"
                      title={rfq.customer.website}
                    >
                      {rfq.customer.website.replace(/^https?:\/\//, "")}
                    </span>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No website</span>
                  )}
                </td>

                {/* Customer Status */}
                <td className="p-3 align-middle">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full ${
                      rfq.customer.status === "active"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    }`}
                  >
                    {rfq.customer.status}
                  </div>
                </td>

                {/* Salesman ID */}
                <td className="p-3 align-middle">
                  {rfq.customer.salesmanId ? (
                    <span
                      className="block overflow-hidden text-ellipsis whitespace-nowrap"
                      title={rfq.customer.salesmanId}
                    >
                      {rfq.customer.salesmanId.slice(-8)}
                    </span>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No salesman</span>
                  )}
                </td>

                {/* Credit Term ID */}
                <td className="p-3 align-middle">
                  {rfq.customer.creditTermId ? (
                    <span
                      className="block overflow-hidden text-ellipsis whitespace-nowrap"
                      title={rfq.customer.creditTermId}
                    >
                      {rfq.customer.creditTermId.slice(-8)}
                    </span>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No credit term</span>
                  )}
                </td>

                {/* Tax ID */}
                <td className="p-3 align-middle">
                  {rfq.customer.taxId ? (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap" title={rfq.customer.taxId}>
                      {rfq.customer.taxId.slice(-8)}
                    </span>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No tax ID</span>
                  )}
                </td>

                {/* Industry ID */}
                <td className="p-3 align-middle">
                  {rfq.customer.industryId ? (
                    <span
                      className="block overflow-hidden text-ellipsis whitespace-nowrap"
                      title={rfq.customer.industryId}
                    >
                      {rfq.customer.industryId.slice(-8)}
                    </span>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No industry</span>
                  )}
                </td>

                {/* Files */}
                <td className="p-3 align-middle">
                  {rfq.files.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.files.slice(0, 2).map((file) => (
                        <div
                          key={file.id}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap"
                          title={file.originalname}
                        >
                          {file.originalname}
                        </div>
                      ))}
                      {rfq.files.length > 2 && (
                        <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          +{rfq.files.length - 2} more files
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No files</span>
                  )}
                </td>

                {/* Services */}
                <td className="p-3 align-middle">
                  {rfq.services.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.services.slice(0, 2).map((service) => (
                        <div
                          key={service.id}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap"
                          title={service.name}
                        >
                          {service.name}
                        </div>
                      ))}
                      {rfq.services.length > 2 && (
                        <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          +{rfq.services.length - 2} more services
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No services</span>
                  )}
                </td>

                {/* RFQ Assembly */}
                <td className="p-3 align-middle">
                  {rfq.rfqAssembly && rfq.rfqAssembly.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.rfqAssembly.slice(0, 2).map((assembly, index) => (
                        <div key={index} className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          Assembly {index + 1}
                        </div>
                      ))}
                      {rfq.rfqAssembly.length > 2 && (
                        <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          +{rfq.rfqAssembly.length - 2} more assemblies
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No assemblies</span>
                  )}
                </td>

                {/* RFQ Specifications */}
                <td className="p-3 align-middle">
                  {rfq.rfqSpecifications.length > 0 ? (
                    <div className="space-y-1">
                      {rfq.rfqSpecifications.slice(0, 3).map((spec, index) => (
                        <div
                          key={index}
                          className="block overflow-hidden text-ellipsis whitespace-nowrap"
                          title={`${spec.specification.name}: ${spec.specification.value}`}
                        >
                          {spec.specification.name}: {spec.specification.value}
                        </div>
                      ))}
                      {rfq.rfqSpecifications.length > 3 && (
                        <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                          +{rfq.rfqSpecifications.length - 3} more specs
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap">No specifications</span>
                  )}
                </td>

                {/* RFQ Created At */}
                <td className="p-3 align-middle">
                  <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    {new Date(rfq.createdAt).toLocaleDateString()}
                  </div>
                </td>

                {/* RFQ Updated At */}
                <td className="p-3 align-middle">
                  <div className="block overflow-hidden text-ellipsis whitespace-nowrap">
                    {new Date(rfq.updatedAt).toLocaleDateString()}
                  </div>
                </td>

                {/* Actions */}
                <td className="p-3 align-middle">
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

