"use client";

import { CreditTermCreateForm } from "@/components/credit-term/credit-term-create-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CreateCreditTermPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/dashboard/credit-terms");
  };

  const handleSuccess = () => {
    router.push("/dashboard/credit-terms");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Credit Term</h1>
         
        </div>
        <Button onClick={handleBack}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>

      <CreditTermCreateForm onSuccess={handleSuccess} onCancel={handleBack} />
    </div>
  );
}
