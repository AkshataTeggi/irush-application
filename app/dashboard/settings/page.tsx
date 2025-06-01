"use client"

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Settings,
  Shield,
  Palette,
  Bell,
  CreditCard,
  Factory,
  Receipt,
  Building2,
  Users,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { AdminOnly } from "@/components/auth/admin-only"

export default function SettingsPage() {
  const { isAdmin } = useAuth()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your application settings and preferences</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Business Configuration - Admin Only */}
        <AdminOnly>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/credit-terms">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Credit Terms
                </CardTitle>
                <CardDescription>Manage payment terms and credit policies</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/industries">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Factory className="h-5 w-5" />
                  Industries
                </CardTitle>
                <CardDescription>Configure industry types and categories</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/tax">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Receipt className="h-5 w-5" />
                  Tax Settings
                </CardTitle>
                <CardDescription>Manage tax rates and configurations</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </AdminOnly>

        {/* System Administration - Admin Only */}
        <AdminOnly>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/departments">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Departments
                </CardTitle>
                <CardDescription>Manage organizational departments</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/users">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard/employees">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Employee Management
                </CardTitle>
                <CardDescription>Manage employee records and information</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </AdminOnly>

        {/* Application Settings - Available to all users */}
        {/* <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/settings/general">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic application preferences and configuration</CardDescription>
            </CardHeader>
          </Link>
        </Card> */}

        {/* <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/settings/security">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Password, authentication, and security preferences</CardDescription>
            </CardHeader>
          </Link>
        </Card> */}

        {/* <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/settings/appearance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Appearance
              </CardTitle>
              <CardDescription>Theme, display, and visual preferences</CardDescription>
            </CardHeader>
          </Link>
        </Card> */}

        {/* <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <Link href="/dashboard/settings/notifications">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Email, push, and alert preferences</CardDescription>
            </CardHeader>
          </Link>
        </Card> */}
      </div>

      {/* Role-based information */}
      <div className="mt-8 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">Access Level</h3>
        {isAdmin ? (
          <p className="text-sm text-muted-foreground">
            You have <span className="font-medium text-green-600">Administrator</span> access and can manage all
            settings.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have <span className="font-medium text-blue-600">Limited</span> access. Some settings are restricted to
            administrators.
          </p>
        )}
      </div>
    </div>
  )
}
