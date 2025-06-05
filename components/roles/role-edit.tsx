// "use client"

// import React, { useState } from "react"
// import { useRouter } from "next/navigation"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import * as z from "zod"
// import { ArrowLeft } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Card, CardContent } from "@/components/ui/card"
// import { useToast } from "@/hooks/use-toast"

// import { Role } from "@/types/department" // Adjust path accordingly

// const formSchema = z.object({
//   name: z.string().min(1, "Role name is required").max(100, "Max 100 characters"),
//   description: z.string().optional(),
//   departmentId: z.string().optional(),
//   isActive: z.boolean(),
// })

// type FormData = z.infer<typeof formSchema>

// interface RoleEditProps {
//   role: Role
//   onBack: () => void
// }

// export const RoleEdit: React.FC<RoleEditProps> = ({ role, onBack }) => {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: role.name,
//       description: role.description || "",
//       departmentId: role.departmentId || "",
//       isActive: role.isActive,
//     },
//   })

//   const onSubmit = async (data: FormData) => {
//     try {
//       setIsSubmitting(true)
//       await updateRole(role.id, data)
//       toast({
//         title: "Success",
//         description: "Role updated successfully",
//       })
//       router.push(`/dashboard/roles/${role.id}`)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update role",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-3xl font-bold tracking-tight">Edit Role</h1>
//         <Button variant="outline" onClick={onBack}>
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Details
//         </Button>
//       </div>

//       {/* Form */}
//       <Card>
//         <CardContent className="mt-5">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               {/* Role Name */}
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Role Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="e.g., Manager, Admin" {...field} />
//                     </FormControl>
//                     <FormDescription>Enter a descriptive name for the role</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Description */}
//               <FormField
//                 control={form.control}
//                 name="description"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Description (Optional)</FormLabel>
//                     <FormControl>
//                       <Textarea
//                         placeholder="Enter role description"
//                         className="resize-none"
//                         {...field}
//                         value={field.value || ""}
//                       />
//                     </FormControl>
//                     <FormDescription>Provide additional details about the role</FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Department ID */}
//               <FormField
//                 control={form.control}
//                 name="departmentId"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Department ID (Optional)</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Department ID" {...field} value={field.value || ""} />
//                     </FormControl>
//                     <FormDescription>
//                       Assign the role to a department by its ID (optional)
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Active Status */}
//               <FormField
//                 control={form.control}
//                 name="isActive"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                     <div className="space-y-0.5">
//                       <FormLabel className="text-base">Active Status</FormLabel>
//                       <FormDescription>
//                         Enable this role for use in your application
//                       </FormDescription>
//                     </div>
//                     <FormControl>
//                       <Switch checked={field.value} onCheckedChange={field.onChange} />
//                     </FormControl>
//                   </FormItem>
//                 )}
//               />

//               {/* Buttons */}
//               <div className="flex gap-4">
//                 <Button type="button" variant="outline" onClick={onBack} className="flex-1">
//                   Cancel
//                 </Button>
//                 <Button type="submit" disabled={isSubmitting} className="flex-1">
//                   {isSubmitting ? "Updating..." : "Update Role"}
//                 </Button>
//               </div>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
















"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

import { updateRole, updateRoleDepartment, assignPermissionsToRole, fetchPermissions } from "@/lib/roles";

import type { Role } from "@/types/department";
import type { Permission } from "@/types/role";
import type { Department } from "@/types/department";
import { fetchDepartments } from "@/lib/department";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  isActive: z.boolean(),
  departmentId: z.string().min(1, "Department is required"),
  permissionIds: z.array(z.string()),
});

type FormValues = z.infer<typeof schema>;

interface RoleUpdateProps {
  role: Role;
}

export const RoleUpdate: React.FC<RoleUpdateProps> = ({ role }) => {
  const router = useRouter();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: role.name,
      description: role.description ?? "",
      isActive: role.isActive,
      departmentId: role.departmentId ?? "",
      permissionIds: Array.isArray(role.permissions) ? role.permissions.map((p) => p.id) : [],
    },
  });

  useEffect(() => {
    const load = async () => {
      const [dept, perms] = await Promise.all([fetchDepartments(), fetchPermissions()]);
      setDepartments(dept);
      setPermissions(perms);
    };
    load();
  }, []);

const onSubmit = async (values: FormValues) => {
  try {
    setLoading(true);

    // 1. Update main role fields
    await updateRole(role.id, {
      name: values.name,
      description: values.description,
      isActive: values.isActive,
    });

    // 2. Update department if changed
    if (role.departmentId !== values.departmentId) {
      await updateRoleDepartment(role.id, values.departmentId);
    }

    // 3. Update permissions only through separate API
    await assignPermissionsToRole(role.id, {
      permissionIds: values.permissionIds,
    });

    toast({
      title: "Success",
      description: "Role updated successfully.",
    });

    router.push(`/dashboard/roles/${role.id}`);
  } catch (err) {
    console.error(err);
    toast({
      title: "Update failed",
      description: "Something went wrong.",
      variant: "destructive",
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Role</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                        <span>{field.value ? "Active" : "Inactive"}</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                        <SelectContent>
                          {departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="permissionIds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissions</FormLabel>
                    <FormControl>
                      {/* Replace MultiSelect with a native multi-select as a fallback */}
                      <select
                        multiple
                        value={field.value}
                        onChange={(e) =>
                          field.onChange(
                            Array.from(e.target.selectedOptions, (option) => option.value)
                          )
                        }
                        className="w-full border rounded p-2"
                      >
                        {permissions.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Update Role"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
