// import { TaxCreateForm } from "@/components/tax/tax-create-form"
// import { Link, Plus } from "lucide-react"
// import { title } from "process"
// import { Button } from "react-day-picker"

// export default function TaxCreatePage() {
//   return (
   

//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold tracking-tight">Create Tax</h1>

//       <Link href="/dashboard/tax">
//         <Button >
//           Back 
//         </Button>
//       </Link>
//       <TaxCreateForm />

//     </div>

    
//   )
// }










import { TaxCreateForm } from "@/components/tax/tax-create-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TaxCreatePage() {
  return (
    <div className="space-y-6">
      {/* Heading and Back button in one row */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Create Tax</h1>

        <Link href="/dashboard/tax">
          <Button>
        <ArrowLeft className="mr-2 h-4 w-4" />

            Back</Button>
        </Link>
      </div>

      {/* Form below */}
      <TaxCreateForm />
    </div>
  )
}
