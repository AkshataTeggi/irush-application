import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function RolesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Roles</h1>
        <p className="text-gray-500 mt-1">Manage user roles and permissions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Roles</CardTitle>
          <CardDescription>View and manage user roles</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Role list will be displayed here.</p>
        </CardContent>
      </Card>
    </div>
  )
}
