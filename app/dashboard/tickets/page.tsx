import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TicketsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Tickets</h1>
        <p className="text-gray-500 mt-1">Manage and track support tickets</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tickets</CardTitle>
          <CardDescription>View and manage all support tickets</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Ticket list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
