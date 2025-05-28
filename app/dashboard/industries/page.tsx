import { Suspense } from "react"
import { fetchIndustries } from "@/lib/industry"
import { IndustryHeader } from "@/components/industry/industry-header"
import { IndustryTabs } from "@/components/industry/industry-tabs"
import { IndustryLoading } from "@/components/industry/industry-loading"
import { IndustryError } from "@/components/industry/industry-error"

export const metadata = {
  title: "Industries | iRUSH",
  description: "Manage industry types",
}

export default async function IndustriesPage() {
  try {
    const industries = await fetchIndustries()

    if (!industries || !Array.isArray(industries)) {
      throw new Error("Invalid industries data received")
    }

    return (
      <div className="space-y-6">
        <IndustryHeader />
        <Suspense fallback={<IndustryLoading />}>
          <IndustryTabs industries={industries} />
        </Suspense>
      </div>
    )
  } catch (error) {
    console.error("Error loading industries:", error)
    return (
      <div className="space-y-6">
        <IndustryHeader />
        <IndustryError
          error={error instanceof Error ? error : new Error("Failed to load industries")}
          reset={() => window.location.reload()}
        />
      </div>
    )
  }
}
