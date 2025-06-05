"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, ArrowLeft, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { CreditTerm } from "@/types/credit-term";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface CreditTermDetailProps {
  creditTerm: CreditTerm;
  onBack: () => void;
}

export function CreditTermDetail({
  creditTerm,
  onBack,
}: CreditTermDetailProps) {
  const isActive = creditTerm.status === "active";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div>
            <h1 className="text-2xl font-bold">Credit Term Details</h1>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href={`/dashboard/credit-terms/${creditTerm.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6 mt-5">
          <div className="space-y-2">
            <Label>ID</Label>
            <Input value={creditTerm.id} disabled className="font-mono" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={creditTerm.name} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="days">Payment Days</Label>
              <Input id="days" value={`${creditTerm.days} days`} disabled />
            </div>
          </div>

          {creditTerm.description && (
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={creditTerm.description}
                rows={3}
                disabled
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Created</Label>
              <Input
                value={new Date(creditTerm.createdAt).toLocaleString()}
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label>Last Updated</Label>
              <Input
                value={new Date(creditTerm.updatedAt).toLocaleString()}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
