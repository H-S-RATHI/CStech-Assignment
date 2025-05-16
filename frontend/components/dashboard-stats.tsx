import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, ListChecks, Users } from "lucide-react"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="border-0 shadow-md bg-gradient-to-br from-violet-500 to-indigo-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Total Agents</CardTitle>
          <Users className="h-5 w-5 text-white opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">5</div>
          <p className="text-xs text-white/70 mt-1">Active agents in the system</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-pink-500 to-rose-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Total Lists</CardTitle>
          <FileSpreadsheet className="h-5 w-5 text-white opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">3</div>
          <p className="text-xs text-white/70 mt-1">Lists uploaded and distributed</p>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-md bg-gradient-to-br from-amber-500 to-orange-500 text-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-medium">Total Leads</CardTitle>
          <ListChecks className="h-5 w-5 text-white opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">125</div>
          <p className="text-xs text-white/70 mt-1">Leads distributed to agents</p>
        </CardContent>
      </Card>
    </div>
  )
}
