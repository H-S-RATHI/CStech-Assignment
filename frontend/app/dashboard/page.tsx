import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardStats } from "@/components/dashboard-stats"
import { RecentActivity } from "@/components/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard.</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
            <CardTitle>Agent Distribution</CardTitle>
            <CardDescription className="text-zinc-100">Overview of list distribution among agents</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((agent) => (
                <div key={agent} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {agent}
                    </div>
                    <span>Agent {agent}</span>
                  </div>
                  <div className="text-sm font-medium">{Math.floor(Math.random() * 20) + 5} leads</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <RecentActivity />
      </div>
    </div>
  )
}
