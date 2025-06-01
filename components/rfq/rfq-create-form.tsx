// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle, Loader2, Search, CheckCircle, User, Mail, Building } from "lucide-react"
// import { Separator } from "@/components/ui/separator"
// import { Checkbox } from "@/components/ui/checkbox"
// import type { CreateRFQDto } from "@/types/rfq"
// import { createRFQ } from "@/lib/rfq"
// import { RFQ_STATUSES } from "@/types/rfq"
// import type { Customer } from "@/types/customer"
// import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
// import { Service, Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

// interface RFQCreateFormProps {
//   onSuccess?: () => void
//   onCancel?: () => void
//   showCard?: boolean
// }

// export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
//   // Basic Information
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [quantity, setQuantity] = useState("")
//   const [status, setStatus] = useState("draft")

//   // Customer Information
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
//   const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

//   // Services and Specifications
//   const [selectedServices, setSelectedServices] = useState<string[]>([])
//   const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>([])

//   // Component state
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   // Data from APIs
//   const [services, setServices] = useState<Service[]>([])
//   const [specifications, setSpecifications] = useState<Specification[]>([])

//   // Loading states
//   const [isLoadingOptions, setIsLoadingOptions] = useState(true)
//   const [optionsError, setOptionsError] = useState<string | null>(null)

//   // Load all options when component mounts
//   useEffect(() => {
//     loadAllOptions()
//   }, [])

//   const loadAllOptions = async () => {
//     setIsLoadingOptions(true)
//     setOptionsError(null)

//     try {
//       const [servicesData, specificationsData] = await Promise.allSettled([fetchServices(), fetchSpecifications()])

//       // Handle services
//       if (servicesData.status === "fulfilled") {
//         setServices(servicesData.value)
//         console.log(`Loaded ${servicesData.value.length} services`)
//       } else {
//         console.error("Failed to load services:", servicesData.reason)
//       }

//       // Handle specifications
//       if (specificationsData.status === "fulfilled") {
//         setSpecifications(specificationsData.value)
//         console.log(`Loaded ${specificationsData.value.length} specifications`)
//       } else {
//         console.error("Failed to load specifications:", specificationsData.reason)
//       }
//     } catch (err) {
//       console.error("Error loading options:", err)
//       setOptionsError("Failed to load form options. Some features may not be available.")
//     } finally {
//       setIsLoadingOptions(false)
//     }
//   }

//   const resetForm = () => {
//     // Basic Information
//     setTitle("")
//     setDescription("")
//     setQuantity("")
//     setStatus("draft")

//     // Customer Information
//     setSelectedCustomer(null)

//     // Services and Specifications
//     setSelectedServices([])
//     setSelectedSpecifications([])

//     // Component state
//     setError(null)
//     setSuccess(false)
//   }

//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer)
//   }

//   const handleServiceToggle = (serviceId: string) => {
//     setSelectedServices((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
//     )
//   }

//   const handleSpecificationToggle = (specificationId: string) => {
//     setSelectedSpecifications((prev) =>
//       prev.includes(specificationId) ? prev.filter((id) => id !== specificationId) : [...prev, specificationId],
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setSuccess(false)
//     setIsSubmitting(true)

//     try {
//       // Validate required fields
//       if (!selectedCustomer) {
//         throw new Error("Please select a customer for this RFQ.")
//       }

//       const rfqData: CreateRFQDto = {
//         title,
//         description,
//         quantity,
//         status,
//         customerId: selectedCustomer.id,
//         ...(selectedServices.length > 0 && { serviceIds: selectedServices }),
//         ...(selectedSpecifications.length > 0 && { specificationIds: selectedSpecifications }),
//       }

//       console.log("Submitting RFQ data:", rfqData)
//       const createdRFQ = await createRFQ(rfqData)
//       console.log("RFQ created successfully:", createdRFQ)
//       setSuccess(true)
//       resetForm()

//       // Call onSuccess callback if provided
//       if (onSuccess) {
//         setTimeout(() => {
//           onSuccess()
//         }, 1500)
//       }
//     } catch (err) {
//       console.error("Error creating RFQ:", err)

//       if (err instanceof Error) {
//         if (err.message.includes("Customer not found")) {
//           setError("The selected customer is no longer available. Please select a different customer.")
//           setSelectedCustomer(null)
//         } else if (err.message.includes("Validation failed")) {
//           setError(err.message)
//         } else {
//           setError(err.message || "Failed to create RFQ. Please try again.")
//         }
//       } else {
//         setError("Failed to create RFQ. Please try again.")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleCancel = () => {
//     resetForm()
//     if (onCancel) {
//       onCancel()
//     }
//   }

//   // Show loading state while options are being fetched
//   if (isLoadingOptions) {
//     return (
//       <Card>
//         <CardContent className="mt-5">
//           <div className="flex items-center justify-center h-32">
//             <Loader2 className="h-6 w-6 animate-spin mr-2" />
//             <span>Loading form options...</span>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const formContent = (
//     <>
//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {success && (
//         <Alert className="mb-4 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//           <CheckCircle className="h-4 w-4" />
//           <AlertDescription>RFQ created successfully!</AlertDescription>
//         </Alert>
//       )}
//       {optionsError && (
//         <Alert className="mb-4 bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{optionsError}</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information Section */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Basic Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title *</Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="RFQ title"
//                 required
//                 disabled={isSubmitting || success}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="quantity">Quantity *</Label>
//               <Input
//                 id="quantity"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 placeholder="e.g., 100"
//                 required
//                 disabled={isSubmitting || success}
//               />
//             </div>

//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Detailed description of the RFQ requirements"
//                 required
//                 disabled={isSubmitting || success}
//                 rows={4}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select value={status} onValueChange={setStatus} disabled={isSubmitting || success}>
//                 <SelectTrigger id="status">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {RFQ_STATUSES.map((statusOption) => (
//                     <SelectItem key={statusOption.value} value={statusOption.value}>
//                       {statusOption.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         {/* Customer Selection Section */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Customer Selection</h3>
//           <div className="flex space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsCustomerSearchOpen(true)}
//               disabled={isSubmitting || success}
//               className="flex-1"
//             >
//               <Search className="mr-2 h-4 w-4" />
//               {selectedCustomer ? "Change Customer" : "Search Customer"}
//             </Button>
//           </div>

//           {/* Selected Customer Information */}
//           {selectedCustomer && (
//             <div className="border rounded-lg p-4 bg-muted/50">
//               <h4 className="font-medium mb-2">Selected Customer</h4>
//               <div className="space-y-2">
//                 <div className="flex items-center text-sm">
//                   <User className="mr-2 h-4 w-4" />
//                   <span className="font-medium">{selectedCustomer.name}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Mail className="mr-2 h-4 w-4" />
//                   <span>{selectedCustomer.email}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Building className="mr-2 h-4 w-4" />
//                   <span>{selectedCustomer.industryType.name}</span>
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   <span className="font-mono">ID: {selectedCustomer.id}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <Separator />

//         {/* Services Selection Section */}
//         {services.length > 0 && (
//           <>
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Services (Optional)</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {services.map((service) => (
//                   <div key={service.id} className="flex items-start space-x-2">
//                     <Checkbox
//                       id={`service-${service.id}`}
//                       checked={selectedServices.includes(service.id)}
//                       onCheckedChange={() => handleServiceToggle(service.id)}
//                       disabled={isSubmitting || success}
//                     />
//                     <div className="grid gap-1.5 leading-none">
//                       <label
//                         htmlFor={`service-${service.id}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                       >
//                         {service.name}
//                       </label>
//                       <p className="text-xs text-muted-foreground">{service.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {selectedServices.length > 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   Selected {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""}
//                 </p>
//               )}
//             </div>
//             <Separator />
//           </>
//         )}

//         {/* Specifications Selection Section */}
//         {specifications.length > 0 && (
//           <>
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Specifications (Optional)</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
//                 {specifications.map((specification) => (
//                   <div key={specification.id} className="flex items-start space-x-2">
//                     <Checkbox
//                       id={`spec-${specification.id}`}
//                       checked={selectedSpecifications.includes(specification.id)}
//                       onCheckedChange={() => handleSpecificationToggle(specification.id)}
//                       disabled={isSubmitting || success}
//                     />
//                     <div className="grid gap-1.5 leading-none">
//                       <label
//                         htmlFor={`spec-${specification.id}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                       >
//                         {specification.name}
//                       </label>
//                       <p className="text-xs text-muted-foreground">{specification.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {selectedSpecifications.length > 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   Selected {selectedSpecifications.length} specification{selectedSpecifications.length !== 1 ? "s" : ""}
//                 </p>
//               )}
//             </div>
//             <Separator />
//           </>
//         )}

//         {/* Submit Buttons */}
//         <div className="flex justify-end space-x-2 pt-4">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
//               Cancel
//             </Button>
//           )}
//           <Button type="submit" disabled={isSubmitting || success || !selectedCustomer}>
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               "Create RFQ"
//             )}
//           </Button>
//         </div>
//       </form>

//       <CustomerSearchDialog
//         open={isCustomerSearchOpen}
//         onOpenChange={setIsCustomerSearchOpen}
//         onSelectCustomer={handleCustomerSelect}
//       />
//     </>
//   )

//   if (showCard) {
//     return (
//       <Card>
//         <CardContent className="mt-5">{formContent}</CardContent>
//       </Card>
//     )
//   }

//   return <div className="space-y-4">{formContent}</div>
// }














// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Card, CardContent } from "@/components/ui/card"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { AlertCircle, Loader2, Search, CheckCircle, User, Mail, Building } from "lucide-react"
// import { Separator } from "@/components/ui/separator"
// import { Checkbox } from "@/components/ui/checkbox"
// import type { CreateRFQDto } from "@/types/rfq"
// import { createRFQ } from "@/lib/rfq"
// import { RFQ_STATUSES } from "@/types/rfq"
// import type { Customer } from "@/types/customer"
// import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
// import { Service, Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

// interface RFQCreateFormProps {
//   onSuccess?: () => void
//   onCancel?: () => void
//   showCard?: boolean
// }

// export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
//   // Basic Information
//   const [title, setTitle] = useState("")
//   const [description, setDescription] = useState("")
//   const [quantity, setQuantity] = useState("")
//   const [status, setStatus] = useState("draft")

//   // Customer Information
//   const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
//   const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

//   // Services and Specifications
//   const [selectedServices, setSelectedServices] = useState<string[]>([])
//   const [selectedSpecifications, setSelectedSpecifications] = useState<string[]>([])

//   // Component state
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [success, setSuccess] = useState(false)

//   // Data from APIs
//   const [services, setServices] = useState<Service[]>([])
//   const [specifications, setSpecifications] = useState<Specification[]>([])

//   // Loading states
//   const [isLoadingOptions, setIsLoadingOptions] = useState(true)
//   const [optionsError, setOptionsError] = useState<string | null>(null)

//   // Load all options when component mounts
//   useEffect(() => {
//     loadAllOptions()
//   }, [])

//   const loadAllOptions = async () => {
//     setIsLoadingOptions(true)
//     setOptionsError(null)

//     try {
//       const [servicesData, specificationsData] = await Promise.allSettled([fetchServices(), fetchSpecifications()])

//       // Handle services
//       if (servicesData.status === "fulfilled") {
//         setServices(servicesData.value)
//         console.log(`Loaded ${servicesData.value.length} services`)
//       } else {
//         console.error("Failed to load services:", servicesData.reason)
//       }

//       // Handle specifications
//       if (specificationsData.status === "fulfilled") {
//         setSpecifications(specificationsData.value)
//         console.log(`Loaded ${specificationsData.value.length} specifications`)
//       } else {
//         console.error("Failed to load specifications:", specificationsData.reason)
//       }
//     } catch (err) {
//       console.error("Error loading options:", err)
//       setOptionsError("Failed to load form options. Some features may not be available.")
//     } finally {
//       setIsLoadingOptions(false)
//     }
//   }

//   const resetForm = () => {
//     // Basic Information
//     setTitle("")
//     setDescription("")
//     setQuantity("")
//     setStatus("draft")

//     // Customer Information
//     setSelectedCustomer(null)

//     // Services and Specifications
//     setSelectedServices([])
//     setSelectedSpecifications([])

//     // Component state
//     setError(null)
//     setSuccess(false)
//   }

//   const handleCustomerSelect = (customer: Customer) => {
//     setSelectedCustomer(customer)
//   }

//   const handleServiceToggle = (serviceId: string) => {
//     setSelectedServices((prev) =>
//       prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
//     )
//   }

//   const handleSpecificationToggle = (specificationId: string) => {
//     setSelectedSpecifications((prev) =>
//       prev.includes(specificationId) ? prev.filter((id) => id !== specificationId) : [...prev, specificationId],
//     )
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError(null)
//     setSuccess(false)
//     setIsSubmitting(true)

//     try {
//       // Validate required fields
//       if (!selectedCustomer) {
//         throw new Error("Please select a customer for this RFQ.")
//       }

//       const rfqData: CreateRFQDto = {
//         title,
//         description,
//         quantity,
//         status,
//         customerId: selectedCustomer.id,
//         ...(selectedServices.length > 0 && { services: selectedServices }),
//       }

//       console.log("Submitting RFQ data:", rfqData)
//       const createdRFQ = await createRFQ(rfqData)
//       console.log("RFQ created successfully:", createdRFQ)
//       setSuccess(true)
//       resetForm()

//       // Call onSuccess callback if provided
//       if (onSuccess) {
//         setTimeout(() => {
//           onSuccess()
//         }, 1500)
//       }
//     } catch (err) {
//       console.error("Error creating RFQ:", err)

//       if (err instanceof Error) {
//         if (err.message.includes("Customer not found")) {
//           setError("The selected customer is no longer available. Please select a different customer.")
//           setSelectedCustomer(null)
//         } else if (err.message.includes("Validation failed")) {
//           setError(err.message)
//         } else {
//           setError(err.message || "Failed to create RFQ. Please try again.")
//         }
//       } else {
//         setError("Failed to create RFQ. Please try again.")
//       }
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleCancel = () => {
//     resetForm()
//     if (onCancel) {
//       onCancel()
//     }
//   }

//   // Show loading state while options are being fetched
//   if (isLoadingOptions) {
//     return (
//       <Card>
//         <CardContent className="mt-5">
//           <div className="flex items-center justify-center h-32">
//             <Loader2 className="h-6 w-6 animate-spin mr-2" />
//             <span>Loading form options...</span>
//           </div>
//         </CardContent>
//       </Card>
//     )
//   }

//   const formContent = (
//     <>
//       {error && (
//         <Alert variant="destructive" className="mb-4">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}
//       {success && (
//         <Alert className="mb-4 bg-green-50 border-green-500 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-400">
//           <CheckCircle className="h-4 w-4" />
//           <AlertDescription>RFQ created successfully!</AlertDescription>
//         </Alert>
//       )}
//       {optionsError && (
//         <Alert className="mb-4 bg-amber-50 border-amber-500 text-amber-700 dark:bg-amber-900/20 dark:border-amber-700 dark:text-amber-400">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{optionsError}</AlertDescription>
//         </Alert>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Basic Information Section */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Basic Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label htmlFor="title">Title *</Label>
//               <Input
//                 id="title"
//                 value={title}
//                 onChange={(e) => setTitle(e.target.value)}
//                 placeholder="RFQ title"
//                 required
//                 disabled={isSubmitting || success}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="quantity">Quantity *</Label>
//               <Input
//                 id="quantity"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 placeholder="e.g., 100"
//                 required
//                 disabled={isSubmitting || success}
//               />
//             </div>

//             <div className="md:col-span-2 space-y-2">
//               <Label htmlFor="description">Description *</Label>
//               <Textarea
//                 id="description"
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 placeholder="Detailed description of the RFQ requirements"
//                 required
//                 disabled={isSubmitting || success}
//                 rows={4}
//               />
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="status">Status</Label>
//               <Select value={status} onValueChange={setStatus} disabled={isSubmitting || success}>
//                 <SelectTrigger id="status">
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {RFQ_STATUSES.map((statusOption) => (
//                     <SelectItem key={statusOption.value} value={statusOption.value}>
//                       {statusOption.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         <Separator />

//         {/* Customer Selection Section */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold">Customer Selection</h3>
//           <div className="flex space-x-2">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsCustomerSearchOpen(true)}
//               disabled={isSubmitting || success}
//               className="flex-1"
//             >
//               <Search className="mr-2 h-4 w-4" />
//               {selectedCustomer ? "Change Customer" : "Search Customer"}
//             </Button>
//           </div>

//           {/* Selected Customer Information */}
//           {selectedCustomer && (
//             <div className="border rounded-lg p-4 bg-muted/50">
//               <h4 className="font-medium mb-2">Selected Customer</h4>
//               <div className="space-y-2">
//                 <div className="flex items-center text-sm">
//                   <User className="mr-2 h-4 w-4" />
//                   <span className="font-medium">{selectedCustomer.name}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Mail className="mr-2 h-4 w-4" />
//                   <span>{selectedCustomer.email}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-muted-foreground">
//                   <Building className="mr-2 h-4 w-4" />
//                   <span>{selectedCustomer.industryType.name}</span>
//                 </div>
//                 <div className="text-xs text-muted-foreground">
//                   <span className="font-mono">ID: {selectedCustomer.id}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>

//         <Separator />

//         {/* Services Selection Section */}
//         {services.length > 0 && (
//           <>
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Services (Optional)</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                 {services.map((service) => (
//                   <div key={service.id} className="flex items-start space-x-2">
//                     <Checkbox
//                       id={`service-${service.id}`}
//                       checked={selectedServices.includes(service.id)}
//                       onCheckedChange={() => handleServiceToggle(service.id)}
//                       disabled={isSubmitting || success}
//                     />
//                     <div className="grid gap-1.5 leading-none">
//                       <label
//                         htmlFor={`service-${service.id}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                       >
//                         {service.name}
//                       </label>
//                       <p className="text-xs text-muted-foreground">{service.description}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {selectedServices.length > 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   Selected {selectedServices.length} service{selectedServices.length !== 1 ? "s" : ""}
//                 </p>
//               )}
//             </div>
//             <Separator />
//           </>
//         )}

//         {/* Specifications Selection Section */}
//         {specifications.length > 0 && (
//           <>
//             <div className="space-y-4">
//               <h3 className="text-lg font-semibold">Specifications (Optional)</h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto border rounded-lg p-4">
//                 {specifications.map((specification) => (
//                   <div key={specification.id} className="flex items-start space-x-2">
//                     <Checkbox
//                       id={`spec-${specification.id}`}
//                       checked={selectedSpecifications.includes(specification.id)}
//                       onCheckedChange={() => handleSpecificationToggle(specification.id)}
//                       disabled={isSubmitting || success}
//                     />
//                     <div className="grid gap-1.5 leading-none">
//                       <label
//                         htmlFor={`spec-${specification.id}`}
//                         className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                       >
//                         {specification.name}
//                       </label>
//                       <p className="text-xs text-muted-foreground">{specification.value}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {selectedSpecifications.length > 0 && (
//                 <p className="text-sm text-muted-foreground">
//                   Selected {selectedSpecifications.length} specification{selectedSpecifications.length !== 1 ? "s" : ""}
//                 </p>
//               )}
//             </div>
//             <Separator />
//           </>
//         )}

//         {/* Submit Buttons */}
//         <div className="flex justify-end space-x-2 pt-4">
//           {onCancel && (
//             <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
//               Cancel
//             </Button>
//           )}
//           <Button type="submit" disabled={isSubmitting || success || !selectedCustomer}>
//             {isSubmitting ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Creating...
//               </>
//             ) : (
//               "Create RFQ"
//             )}
//           </Button>
//         </div>
//       </form>

//       <CustomerSearchDialog
//         open={isCustomerSearchOpen}
//         onOpenChange={setIsCustomerSearchOpen}
//         onSelectCustomer={handleCustomerSelect}
//       />
//     </>
//   )

//   if (showCard) {
//     return (
//       <Card>
//         <CardContent className="mt-5">{formContent}</CardContent>
//       </Card>
//     )
//   }

//   return <div className="space-y-4">{formContent}</div>
// }


















"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Phone, Mail, CheckCircle, Upload, X, AlertCircle, Loader2, ArrowLeft } from "lucide-react"
// import { useDropzone } from "react-dropzone"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import type { CreateRFQDto } from "@/types/rfq"
import { createRFQ } from "@/lib/rfq"
import { RFQ_STATUSES } from "@/types/rfq"
import type { Customer } from "@/types/customer"
import { CustomerSearchDialog } from "@/components/rfq/customer-search-dialog"
import { Specification, fetchServices, fetchSpecifications } from "@/lib/rfq-option"

interface RFQCreateFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  showCard?: boolean
}

interface SpecificationValue {
  specificationId: string
  value: string
  unit?: string
}

interface UploadingFile {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
  uploadedBytes: number
  serverData?: {
    id: string
    filename: string
    originalname: string
    size: number
    mimetype: string
  }
}

export function RFQCreateForm({ onSuccess, onCancel, showCard = true }: RFQCreateFormProps) {
  // Step tracking
  const [step, setStep] = useState<"customer-selection" | "form-completion">("customer-selection")

  // Basic Information
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [quantity, setQuantity] = useState("")
  const [status, setStatus] = useState("draft")
  const [projectName, setProjectName] = useState("")

  // Customer Information
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [isCustomerSearchOpen, setIsCustomerSearchOpen] = useState(false)

  // Services
  const [selectedServices, setSelectedServices] = useState<string[]>([])

  // Specifications
  const [specifications, setSpecifications] = useState<Specification[]>([])
  const [specificationValues, setSpecificationValues] = useState<SpecificationValue[]>([])
  const [customInputStates, setCustomInputStates] = useState<
    Record<string, { showCustomInput: boolean; customValue: string; selectedUnit?: string }>
  >({})

  // Files
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [fileUploadError, setFileUploadError] = useState<string | null>(null)
  const [fileInfoOpen, setFileInfoOpen] = useState(false)
  const [currentlyUploadingFile, setCurrentlyUploadingFile] = useState<string | null>(null)
  const [activeUploads, setActiveUploads] = useState<Map<string, XMLHttpRequest>>(new Map())

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({})
  const [terms, setTerms] = useState(false)
  const [newsletter, setNewsletter] = useState(false)

  // Data from APIs
  const [services, setServices] = useState<any[]>([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState<string | null>(null)
  const [isLoadingSpecifications, setIsLoadingSpecifications] = useState(false)
  const [specificationsError, setSpecificationsError] = useState<string | null>(null)

  const router = useRouter()

  const acceptedFileTypes = {
    "application/zip": [".zip"],
    "application/x-rar-compressed": [".rar"],
    "application/pdf": [".pdf"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    "application/vnd.ms-excel": [".xls"],
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "text/csv": [".csv"],
    "text/plain": [".txt"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/svg+xml": [".svg"],
    "application/octet-stream": [
      ".sch",
      ".schdoc",
      ".brd",
      ".pcb",
      ".pcbdoc",
      ".dsn",
      ".dxf",
      ".dwg",
      ".step",
      ".stp",
      ".gbr",
      ".ger",
      ".gbl",
      ".gtl",
      ".drl",
      ".bom",
    ],
  }

  // Load services and specifications when moving to form completion step
  useEffect(() => {
    if (step === "form-completion") {
      loadServices()
      loadSpecifications()
    }
  }, [step])

  const loadServices = async () => {
    setIsLoadingServices(true)
    setServicesError(null)

    try {
      const servicesData = await fetchServices()
      setServices(servicesData.filter((service) => service.isActive && !service.deletedAt))
    } catch (err) {
      console.error("Failed to load services:", err)
      setServicesError("Failed to load services. Some features may not be available.")
    } finally {
      setIsLoadingServices(false)
    }
  }

  const loadSpecifications = async () => {
    setIsLoadingSpecifications(true)
    setSpecificationsError(null)

    try {
      const specificationsData = await fetchSpecifications()
      setSpecifications(specificationsData.filter((spec) => spec.isActive && !spec.isDeleted))
    } catch (err) {
      console.error("Failed to load specifications:", err)
      setSpecificationsError("Failed to load specifications. Some features may not be available.")
    } finally {
      setIsLoadingSpecifications(false)
    }
  }

  const resetForm = () => {
    setStep("customer-selection")
    setTitle("")
    setDescription("")
    setQuantity("")
    setStatus("draft")
    setProjectName("")
    setSelectedCustomer(null)
    setSelectedServices([])
    setSpecificationValues([])
    setCustomInputStates({})
    setSelectedFiles([])
    setUploadingFiles([])
    setIsUploading(false)
    setFileUploadError(null)
    setFileInfoOpen(false)
    setCurrentlyUploadingFile(null)
    setActiveUploads(new Map())
    setFormErrors({})
    setTerms(false)
    setNewsletter(false)
    setError(null)
    setSuccess(false)
    setIsSubmitted(false)
    setIsSubmitting(false)
  }

  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomer(customer)
    setStep("form-completion")
  }

  const handleChangeCustomer = () => {
    setIsCustomerSearchOpen(true)
  }

  const handleBackToCustomerSelection = () => {
    setStep("customer-selection")
  }

  // File upload with dropzone
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setFileUploadError(null)

    if (rejectedFiles.length > 0) {
      const rejectedNames = rejectedFiles.map((f) => f.file.name).join(", ")
      setFileUploadError(`Some files were rejected: ${rejectedNames}`)
    }

    const validFiles: File[] = []
    const oversizedFiles: string[] = []

    acceptedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024 * 1024) {
        // 5GB limit
        oversizedFiles.push(file.name)
      } else {
        validFiles.push(file)
      }
    })

    if (oversizedFiles.length > 0) {
      setFileUploadError(`Files exceed 5GB limit: ${oversizedFiles.join(", ")}`)
    }

    setSelectedFiles((prev) => [...prev, ...validFiles])

    const newUploadingFiles: UploadingFile[] = validFiles.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      progress: 0,
      status: "pending",
      uploadedBytes: 0,
    }))

    setUploadingFiles((prev) => [...prev, ...newUploadingFiles])
    setFileInfoOpen(true)
  }, [])

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   onDrop,
  //   accept: acceptedFileTypes,
  //   maxSize: 5 * 1024 * 1024 * 1024, // 5GB
  //   multiple: true,
  // })

  // Handle specification change
  const handleSpecificationChange = (specId: string, value: string | number | boolean) => {
    setSpecificationValues((prev) => {
      const existingIndex = prev.findIndex((spec) => spec.specificationId === specId)

      if (!value || value === "" || value === false) {
        return existingIndex >= 0 ? prev.filter((_, index) => index !== existingIndex) : prev
      }

      if (existingIndex >= 0) {
        return prev.map((spec, index) => (index === existingIndex ? { ...spec, value: String(value) } : spec))
      }

      return [...prev, { specificationId: specId, value: String(value) }]
    })
  }

  // Handle service toggle
  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  // Remove file
  const removeFile = (fileId: string) => {
    const uploadingFile = uploadingFiles.find((f) => f.id === fileId)
    if (uploadingFile) {
      if (uploadingFile.status === "uploading") {
        const xhr = activeUploads.get(fileId)
        if (xhr) {
          setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
          setSelectedFiles((prev) => prev.filter((f) => f.name !== uploadingFile.file.name))
          if (currentlyUploadingFile && currentlyUploadingFile.includes(uploadingFile.file.name)) {
            setCurrentlyUploadingFile(null)
          }
          xhr.abort()
          setActiveUploads((prev) => {
            const newMap = new Map(prev)
            newMap.delete(fileId)
            return newMap
          })
        }
      } else {
        setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId))
        setSelectedFiles((prev) => prev.filter((f) => f.name !== uploadingFile.file.name))
      }
    }
  }

  // Get status icon
  const getStatusIcon = (status: string, fileName: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case "uploading":
        return (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 text-blue-500 animate-spin mr-1" />
          </div>
        )
      case "pending":
        return <div className="h-4 w-4 border-2 border-gray-400 rounded-full bg-gray-100" />
      default:
        return <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
    }
  }

  // Render specification input
  const renderSpecificationInput = (spec: Specification) => {
    const specState = customInputStates[spec.id] || {
      showCustomInput: false,
      customValue: "",
      selectedUnit: spec.allowedUnits && spec.allowedUnits.length > 0 ? spec.allowedUnits[0] : "MM",
    }

    const currentValue = specificationValues.find((s) => s.specificationId === spec.id)?.value || ""

    switch (spec.type || "TEXT") {
      case "TEXT":
        if (spec.hasDimension && spec.allowedUnits && spec.allowedUnits.length > 0) {
          return (
            <div className="flex items-center space-x-2">
              <Input
                value={currentValue}
                onChange={(e) => handleSpecificationChange(spec.id, e.target.value)}
                placeholder={`Enter ${spec.name}`}
                className="flex-1"
              />
              <Select
                value={specState.selectedUnit}
                onValueChange={(unit) => {
                  setCustomInputStates((prev) => ({
                    ...prev,
                    [spec.id]: { ...specState, selectedUnit: unit },
                  }))
                }}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {spec.allowedUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        }
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleSpecificationChange(spec.id, e.target.value)}
            placeholder={`Enter ${spec.name}`}
          />
        )

      case "SELECT":
      case "DROPDOWN":
        const options = spec.suggestions || []
        return (
          <Select
            value={currentValue || "default"} // Updated to have a non-empty default value
            onValueChange={(value) => handleSpecificationChange(spec.id, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${spec.name}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Select an option</SelectItem> // Updated to have a non-empty value
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
              onCheckedChange={(checked) => handleSpecificationChange(spec.id, checked)}
            />
            <Label className="text-sm">{spec.name}</Label>
          </div>
        )

      default:
        return (
          <Input
            value={currentValue}
            onChange={(e) => handleSpecificationChange(spec.id, e.target.value)}
            placeholder={`Enter ${spec.name}`}
          />
        )
    }
  }

  // Form validation
  const validateForm = (): boolean => {
    let valid = true
    const newFormErrors: { [key: string]: string } = {}

    if (!selectedCustomer) {
      newFormErrors.customer = "Customer selection is required."
      valid = false
    }
    if (!title) {
      newFormErrors.title = "Title is required."
      valid = false
    }
    if (!terms) {
      newFormErrors.terms = "You must accept the Terms & Conditions to submit."
      valid = false
    }

    setFormErrors(newFormErrors)
    return valid
  }

  // Handle form submission
  const handleSubmit = async () => {
    setError(null)
    setFileUploadError(null)

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const rfqData: CreateRFQDto = {
        title,
        description,
        status,
        quantity,
        customerId: selectedCustomer!.id,
        ...(selectedServices.length > 0 && { services: selectedServices }),
        ...(specificationValues.length > 0 && { rfqSpecifications: specificationValues }),
      }

      const createdRFQ = await createRFQ(rfqData)
      setSuccess(true)
      setIsSubmitted(true)

      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating RFQ:", err)
      setError(err instanceof Error ? err.message : "Failed to create RFQ. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Customer Selection Step
  const renderCustomerSelectionStep = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Select a Customer</h3>
        <p className="text-sm text-muted-foreground">
          First, select a customer for this RFQ. You'll be able to fill in the RFQ details after selecting a customer.
        </p>

        <div className="flex space-x-2">
          <Button type="button" onClick={() => setIsCustomerSearchOpen(true)} className="flex-1">
            <Mail className="mr-2 h-4 w-4" />
            Search for a Customer
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <AlertCircle className="h-4 w-4 inline mr-2" />
          {error}
        </div>
      )}

      <CustomerSearchDialog
        open={isCustomerSearchOpen}
        onOpenChange={setIsCustomerSearchOpen}
        onSelectCustomer={handleCustomerSelect}
      />
    </div>
  )

  // Form Completion Step
  const renderFormCompletionStep = () => {
    if (isLoadingServices || isLoadingSpecifications) {
      return (
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Button type="button" variant="ghost" size="sm" onClick={handleBackToCustomerSelection}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h3 className="text-lg font-semibold">Create RFQ for {selectedCustomer?.name}</h3>
          </div>

          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Loading form options...</span>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleBackToCustomerSelection}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <h1 className="font-bold text-xl sm:text-2xl">Request for Quote</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <Phone className="h-4 w-4 mr-2" />
              <span className="text-sm">(408) 943-8760</span>
            </div>
            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
              <Mail className="h-4 w-4 mr-2" />
              <span className="text-sm">sales@networkpcb.com</span>
            </div>
          </div>
        </div>

        {/* Customer Information Display */}
        <Card className="border-t-4 border-t-green-600">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="font-medium text-lg">Customer: {selectedCustomer?.name}</h4>
              <Button type="button" variant="outline" size="sm" onClick={handleChangeCustomer}>
                Change Customer
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Email:</span> {selectedCustomer?.email}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {selectedCustomer?.phone}
              </div>
              <div>
                <span className="font-medium">Industry:</span> {selectedCustomer?.industryType?.name || "Not specified"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Form */}
        <Card>
          <CardContent className="p-6">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Project Title <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter project title"
                    required
                  />
                  {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {RFQ_STATUSES.map((statusOption) => (
                        <SelectItem key={statusOption.value} value={statusOption.value}>
                          {statusOption.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Services */}
              {services.length > 0 && (
                <div className="space-y-4">
                  <Label className="font-medium">Service Type (Check all that apply)</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {services.map((service) => (
                      <div key={service.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={service.id}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() => handleServiceToggle(service.id)}
                        />
                        <Label htmlFor={service.id} className="text-sm">
                          {service.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
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

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter description"
                  rows={4}
                />
              </div>

              {/* File Upload */}
              <div className="space-y-4">
                <Label className="block mb-2 text-sm font-medium">Upload Files (Up to 5GB each)</Label>

                <div
                  // {...getRootProps()}
                  // className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                  //   isDragActive
                  //     ? "border-blue-500 bg-blue-50"
                  //     : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  // }`}
                >
                  {/* <input {...getInputProps()} /> */}
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  {/* {isDragActive ? (
                    <p className="text-blue-600">Drop the files here...</p>
                  ) : (
                    <div>
                      <p className="text-gray-600 mb-1">Drag & drop files here, or click to select</p>
                      <p className="text-sm text-gray-500">Supports files up to 5GB each</p>
                    </div>
                  )} */}
                </div>

                {/* File List */}
                {uploadingFiles.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Selected Files ({uploadingFiles.length}):</h4>
                    <ul className="space-y-3 max-h-80 overflow-y-auto">
                      {uploadingFiles.map((uploadingFile) => (
                        <li
                          key={uploadingFile.id}
                          className={`flex items-center justify-between text-sm p-3 rounded border ${
                            uploadingFile.status === "completed"
                              ? "bg-green-50 border-green-200"
                              : uploadingFile.status === "error"
                                ? "bg-red-50 border-red-200"
                                : uploadingFile.status === "uploading"
                                  ? "bg-blue-50 border-blue-200"
                                  : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-center space-x-3 flex-grow">
                            {getStatusIcon(uploadingFile.status, uploadingFile.file.name)}
                            <div className="flex-grow">
                              <div className="flex items-center justify-between">
                                <span className="truncate font-medium">{uploadingFile.file.name}</span>
                                <span className="text-xs text-gray-500 ml-2">
                                  {uploadingFile.file.size >= 1024 * 1024 * 1024
                                    ? `${(uploadingFile.file.size / (1024 * 1024 * 1024)).toFixed(2)} GB`
                                    : `${(uploadingFile.file.size / (1024 * 1024)).toFixed(2)} MB`}
                                </span>
                              </div>

                              {uploadingFile.status === "uploading" && (
                                <div className="mt-1">
                                  <div className="w-full bg-gray-200 rounded-full h-1">
                                    <div
                                      className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadingFile.progress}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs text-blue-600 mt-1">{uploadingFile.progress}% uploaded</span>
                                </div>
                              )}

                              {uploadingFile.status === "error" && uploadingFile.error && (
                                <div className="mt-1 text-xs text-red-500">{uploadingFile.error}</div>
                              )}
                            </div>
                          </div>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(uploadingFile.id)}
                            className="h-8 w-8 text-red-500 hover:text-red-700 ml-4"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {fileUploadError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong className="font-bold">Error: </strong>
                    <span>{fileUploadError}</span>
                  </div>
                )}

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="file-info">
                    <AccordionTrigger className="text-sm text-green-800 font-medium">
                      Accepted files and upload guidelines
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="border border-green-200 rounded-md p-4">
                        <p className="text-xs text-green-700 mb-2">
                          Zip or rar format with BOM/P&P files; XLSX, DOC, CSV, PDF, TXT, CAD/CAM files
                        </p>
                        <div className="text-xs text-green-700 mb-3">
                          <p className="font-medium mb-1">Supported formats:</p>
                          <p className="break-words">
                            zip, rar, xls, xlsx, doc, docx, csv, pdf, txt, sch, schdoc, brd, pcb, pcbdoc, dsn, dxf, dwg,
                            step, stp, gbr, ger, gbl, gtl, drl, bom, jpg, jpeg, png, svg
                          </p>
                        </div>
                        <ul className="text-sm text-green-700 list-disc list-inside space-y-1">
                          <li>Maximum file size: 5GB per file</li>
                          <li>BOM and P&P files must be included within zip or rar archives</li>
                          <li>Nested archives are limited to one level deep</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={terms} onCheckedChange={setTerms} />
                  <Label htmlFor="terms" className="text-sm">
                    I accept the{" "}
                    <a href="/terms-conditions" className="text-blue-600 underline">
                      Terms & Conditions
                    </a>
                  </Label>
                </div>
                {formErrors.terms && <p className="text-red-500 text-xs">{formErrors.terms}</p>}

                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" checked={newsletter} onCheckedChange={setNewsletter} />
                  <Label htmlFor="newsletter" className="text-sm">
                    Subscribe to NPCB Newsletter
                  </Label>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  <strong className="font-bold">Error: </strong>
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-center sm:justify-end">
                <Button
                  type="submit"
                  className="w-full sm:w-auto px-8 bg-black text-white"
                  disabled={isSubmitting || isUploading}
                >
                  {isSubmitting ? "Submitting..." : isUploading ? "Uploading..." : "Submit RFQ"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <CustomerSearchDialog
          open={isCustomerSearchOpen}
          onOpenChange={setIsCustomerSearchOpen}
          onSelectCustomer={handleCustomerSelect}
        />
      </div>
    )
  }

  // Success state
  if (isSubmitted) {
    return (
      <div className="p-8 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-t-green-500">
          <div className="flex flex-col items-center text-center">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle className="text-green-500 h-12 w-12" />
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Request Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your RFQ submission. Our team will review your request and get back to you shortly.
            </p>

            <div className="bg-gray-50 w-full p-4 rounded-md mb-6 border border-gray-200">
              <div className="text-left">
                <p className="text-sm text-gray-500 mb-1">Reference Number:</p>
                <p className="font-medium">RFQ-{new Date().getTime()}</p>
                <p className="text-sm text-gray-500 mt-3 mb-1">Submitted On:</p>
                <p className="font-medium">{new Date().toLocaleString()}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Submit Another Request
              </Button>
              <Button onClick={() => router.push("/")} className="flex-1 bg-green-600 hover:bg-green-700">
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const content = step === "customer-selection" ? renderCustomerSelectionStep() : renderFormCompletionStep()

  if (showCard) {
    return (
      <Card>
        <CardContent className="mt-5">{content}</CardContent>
      </Card>
    )
  }

  return <div className="space-y-4">{content}</div>
}
