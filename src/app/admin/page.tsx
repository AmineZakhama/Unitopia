import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Link href="/admin/clubs" className="hover:scale-[1.02] transition-transform">
        <Card className="bg-slate-900 border-primary/20 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Club Management
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Manage Clubs</div>
            <p className="text-xs text-slate-400">
              Create, edit, and approve student clubs
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/academic" className="hover:scale-[1.02] transition-transform">
        <Card className="bg-slate-900 border-primary/20 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Academic Hub
            </CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Academic Config</div>
            <p className="text-xs text-slate-400">
              Manage courses, majors, and calendar events
            </p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/admin/super" className="hover:scale-[1.02] transition-transform">
        <Card className="bg-slate-900 border-primary/20 hover:border-primary/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-200">
              Super Admin
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">System Settings</div>
            <p className="text-xs text-slate-400">
              Global configurations and user roles
            </p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
