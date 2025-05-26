import { Badge } from "@/components/ui/badge"

interface RFQStatusBadgeProps {
  status: string
}

export function RFQStatusBadge({ status }: RFQStatusBadgeProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "draft":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case "in_review":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_review":
        return "In Review"
      case "draft":
        return "Draft"
      case "approved":
        return "Approved"
      case "rejected":
        return "Rejected"
      case "completed":
        return "Completed"
      case "cancelled":
        return "Cancelled"
      default:
        return status.charAt(0).toUpperCase() + status.slice(1)
    }
  }

  return <Badge className={`${getStatusColor(status)} border-0`}>{getStatusLabel(status)}</Badge>
}
