import { VendorCreateForm } from "@/components/vendor/vendor-create-form"

export default function CreateVendorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Vendor</h1>
        <p className="text-muted-foreground">Add a new vendor to your system</p>
      </div>
      <VendorCreateForm />
    </div>
  )
}
