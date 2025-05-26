import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function QuotePage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quotes</h1>
        <p className="text-gray-500 mt-1">Manage customer quotes</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Quotes</CardTitle>
          <CardDescription>View and manage quotes</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Quote list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
