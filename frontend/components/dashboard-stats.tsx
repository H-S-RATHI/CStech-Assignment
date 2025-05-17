import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, ListChecks, Users } from "lucide-react"
import Link from "next/link"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Link href="/dashboard/agents" className="block">
        <Card className="border-0 shadow-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white hover:opacity-90 transition-opacity duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Agents</CardTitle>
            <Users className="h-5 w-5 text-white opacity-70" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-white/70 mt-1">Active agents in the system</p>
          </CardContent>
        </Card>
      </Link>

      <Link href="/dashboard/lists" className="block">
        <Card className="border-0 shadow-md bg-gradient-to-br from-pink-500 to-rose-500 text-white hover:opacity-90 transition-opacity duration-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-medium">Lists</CardTitle>
            <FileSpreadsheet className="h-5 w-5 text-white opacity-70" />
          </CardHeader>
          <CardContent>
            <p className="text-xs text-white/70 mt-1">Lists uploaded and distributed</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
