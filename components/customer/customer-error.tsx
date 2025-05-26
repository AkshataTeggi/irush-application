interface CustomerErrorProps {
  error: string
}

export function CustomerError({ error }: CustomerErrorProps) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customers</h1>
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  )
}
