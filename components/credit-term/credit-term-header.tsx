"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CreditTermHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Credit Terms</h1>
      </div>
      <Button asChild>
        <Link href="/dashboard/credit-terms/create">
          <Plus className="mr-2 h-4 w-4" />
          Add Credit Term
        </Link>
      </Button>
    </div>
  )
}
