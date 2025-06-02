"use client"
import { CheckCircle, FileSpreadsheet, AlertCircle, Loader2, Package, Layers } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ExcelProcessingResult {
  filename: string
  success: boolean
  result?: {
    message: string
    extractedSpecs: { key: string; value: any }[]
    extractedAssembly: { component: string; quantity: any }[]
    extractedImages: string[]
  }
  error?: string
}

interface SuccessStateProps {
  onReset: () => void
  onViewRFQs: () => void
  excelProcessingResults?: ExcelProcessingResult[]
  isProcessingExcel?: boolean
}

export function SuccessState({
  onReset,
  onViewRFQs,
  excelProcessingResults = [],
  isProcessingExcel = false,
}: SuccessStateProps) {
  const successfulProcessing = excelProcessingResults.filter((r) => r.success)
  const failedProcessing = excelProcessingResults.filter((r) => !r.success)

  const totalSpecs = successfulProcessing.reduce((acc, result) => acc + (result.result?.extractedSpecs.length || 0), 0)
  const totalAssembly = successfulProcessing.reduce(
    (acc, result) => acc + (result.result?.extractedAssembly.length || 0),
    0,
  )
  const totalImages = successfulProcessing.reduce(
    (acc, result) => acc + (result.result?.extractedImages.length || 0),
    0,
  )

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 border-t-4 border-t-green-500">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-green-100 p-3 mb-4">
            <CheckCircle className="text-green-500 h-12 w-12" />
          </div>
          <h2 className="text-2xl font-bold text-green-700 mb-2">RFQ Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Your RFQ has been submitted and is now being processed. Our team will review your request and get back to
            you shortly.
          </p>

          {/* Excel Processing Status */}
          {isProcessingExcel && (
            <Alert className="w-full mb-6 bg-blue-50 border-blue-200 text-blue-800">
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                <div className="flex items-center">
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Processing Excel files to extract specifications...
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Excel Processing Results */}
          {excelProcessingResults.length > 0 && !isProcessingExcel && (
            <div className="w-full mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5" />
                Excel Processing Results
              </h3>

              {/* Summary */}
              {successfulProcessing.length > 0 && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        Successfully processed {successfulProcessing.length} Excel file
                        {successfulProcessing.length > 1 ? "s" : ""}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {totalSpecs > 0 && (
                          <Badge variant="outline" className="flex items-center">
                            <Package className="mr-1 h-3 w-3" />
                            {totalSpecs} Specifications
                          </Badge>
                        )}
                        {totalAssembly > 0 && (
                          <Badge variant="outline" className="flex items-center">
                            <Layers className="mr-1 h-3 w-3" />
                            {totalAssembly} Assembly Items
                          </Badge>
                        )}
                        {totalImages > 0 && (
                          <Badge variant="outline" className="flex items-center">
                            <FileSpreadsheet className="mr-1 h-3 w-3" />
                            {totalImages} Images
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Failed Processing */}
              {failedProcessing.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">
                        Failed to process {failedProcessing.length} Excel file{failedProcessing.length > 1 ? "s" : ""}
                      </p>
                      <ul className="text-sm list-disc list-inside">
                        {failedProcessing.map((result, index) => (
                          <li key={index}>
                            {result.filename}: {result.error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Detailed Results */}
              {successfulProcessing.length > 0 && (
                <div className="space-y-3">
                  {successfulProcessing.map((result, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-md border">
                      <h4 className="font-medium text-sm mb-2 flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4 text-green-600" />
                        {result.filename}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">{result.result?.message}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {result.result?.extractedSpecs.length || 0} specs
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {result.result?.extractedAssembly.length || 0} assembly
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {result.result?.extractedImages.length || 0} images
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Reference Information */}
          <div className="bg-gray-50 w-full p-4 rounded-md mb-6 border border-gray-200">
            <div className="text-left">
              <p className="text-sm text-gray-500 mb-1">Reference Number:</p>
              <p className="font-medium">RFQ-{new Date().getTime()}</p>
              <p className="text-sm text-gray-500 mt-3 mb-1">Submitted On:</p>
              <p className="font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button onClick={onReset} variant="outline" className="flex-1">
              Create Another RFQ
            </Button>
            <Button onClick={onViewRFQs} className="flex-1 bg-green-600 hover:bg-green-700">
              View All RFQs
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
