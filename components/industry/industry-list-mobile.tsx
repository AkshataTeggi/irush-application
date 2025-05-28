import type React from "react"
import type { Industry } from "@/types/industry"

interface IndustryListMobileProps {
  industries: Industry[]
}

const IndustryListMobile: React.FC<IndustryListMobileProps> = ({ industries }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {industries.map((industry) => (
        <div key={industry.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="relative">
            <img
            //   src={industry.imageUrl || "/placeholder.svg"}
              alt={industry.name}
              className="w-full h-48 object-cover"
            />
            {industry.status && (
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${industry.status === "Active" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}
                >
                  {industry.status}
                </span>
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{industry.name}</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{industry.description}</p>
            {/* <a href={industry.learnMoreUrl} className="text-blue-500 hover:underline">
              Learn More
            </a> */}
          </div>
        </div>
      ))}
    </div>
  )
}

export default IndustryListMobile
