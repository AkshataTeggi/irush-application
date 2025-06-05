"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createPermission } from "@/lib/roles";
import { Card, CardContent } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(1, "Permission name is required"),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function CreatePermissionForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await createPermission(values);
      toast({
        title: "Success",
        description: "Permission created successfully",
      });
      reset();
      onSuccess?.();
      router.push("/dashboard/roles"); // Redirect to roles page
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create permission",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-5">
      <CardContent className="mt-5">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-md">
          <div>
            <Label htmlFor="name">Permission Name</Label>
            <Input id="name" {...register("name")} disabled={loading} />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} disabled={loading} />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Permission"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
