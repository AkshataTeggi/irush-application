// "use client"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import * as z from "zod"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Switch } from "@/components/ui/switch"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Card, CardContent, CardHeader } from "@/components/ui/card"
// import { createRole } from "@/lib/roles"  // You need to implement this API call
// import { useToast } from "@/hooks/use-toast"

// const formSchema = z.object({
//   name: z.string().min(1, "Role name is required").max(100, "Name must be less than 100 characters"),
//   description: z.string().optional(),
//   isActive: z.boolean().default(true),
// })

// type FormData = z.infer<typeof formSchema>

// export function RoleCreateForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const router = useRouter()
//   const { toast } = useToast()

//   const form = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: "",
//       description: "",
//       isActive: true,
//     },
//   })

//   const onSubmit = async (data: FormData) => {
//     try {
//       setIsSubmitting(true)
//       const role = await createRole(data)  // call your API helper
//       toast({
//         title: "Success",
//         description: "Role created successfully",
//       })
//       router.push(`/dashboard/roles/${role.id}`)
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to create role",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <h2 className="text-lg font-semibold">Create New Role</h2>
//       </CardHeader>
//       <CardContent className="mt-5">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Role Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="e.g., Admin, Manager" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description (Optional)</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Describe the role..."
//                       className="resize-none"
//                       {...field}
//                       value={field.value || ""}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="isActive"
//               render={({ field }) => (
//                 <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                   <div className="space-y-0.5">
//                     <FormLabel className="text-base">Active Status</FormLabel>
//                   </div>
//                   <FormControl>
//                     <Switch checked={field.value} onCheckedChange={field.onChange} />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             <div className="flex gap-4">
//               <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting} className="flex-1">
//                 {isSubmitting ? "Creating..." : "Create Role"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }

















"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { createRole, fetchPermissions } from "@/lib/roles" // Your API helper
import { useToast } from "@/hooks/use-toast"
import { fetchDepartments } from "@/lib/department"

// You need to create these API helpers for fetching data

const formSchema = z.object({
  name: z.string().min(1, "Role name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
  departmentId: z.string().min(1, "Department is required"),
  permissionIds: z.array(z.string()).min(1, "Select at least one permission"),
})

type FormData = z.infer<typeof formSchema>

export function RoleCreateForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [permissions, setPermissions] = useState<{ id: string; name: string }[]>([])

  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
      departmentId: "",
      permissionIds: [],
    },
  })

  // Fetch departments & permissions on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [deptData, permData] = await Promise.all([fetchDepartments(), fetchPermissions()])
        setDepartments(deptData)
        setPermissions(permData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load departments or permissions",
          variant: "destructive",
        })
      }
    }
    loadData()
  }, [toast])

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      const role = await createRole(data) // Your existing API helper
      toast({
        title: "Success",
        description: "Role created successfully",
      })
      router.push(`/dashboard/roles/${role.id}`)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create role",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Create New Role</h2>
      </CardHeader>
      <CardContent className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Admin, Manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the role..." className="resize-none" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Department dropdown */}
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full rounded border border-gray-300 p-2"
                      disabled={departments.length === 0}
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Permissions multi-select */}
<FormField
  control={form.control}
  name="permissionIds"
  render={({ field }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    // Close dropdown on outside click
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const onCheckboxChange = (id: string) => {
      if (field.value.includes(id)) {
        field.onChange(field.value.filter((v) => v !== id));
      } else {
        field.onChange([...field.value, id]);
      }
    };

    return (
      <FormItem className="relative">
        <FormLabel>Permissions</FormLabel>
        <FormControl>
          <div ref={dropdownRef} className="relative">
            <div
              tabIndex={0}
              role="button"
              onClick={toggleDropdown}
              className="w-full rounded border border-gray-300 p-2 cursor-pointer select-none"
            >
              {field.value.length === 0
                ? "Select permissions"
                : permissions
                    .filter((perm) => field.value.includes(perm.id))
                    .map((perm) => perm.name)
                    .join(", ")}
            </div>

            {isOpen && (
              <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border border-gray-300 bg-white p-2 shadow-lg">
                {permissions.map((perm) => (
                  <label
                    key={perm.id}
                    className="flex items-center space-x-2 py-1 px-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={field.value.includes(perm.id)}
                      onChange={() => onCheckboxChange(perm.id)}
                      className="h-4 w-4 cursor-pointer"
                      onMouseDown={(e) => e.stopPropagation()} // prevent closing
                    />
                    <span>{perm.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </FormControl>
        <FormMessage />
      </FormItem>
    );
  }}
/>



            {/* Active Status Switch */}
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Active Status</FormLabel>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting ? "Creating..." : "Create Role"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
