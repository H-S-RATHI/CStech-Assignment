import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentsList } from "@/components/agents-list"
import { AddAgentForm } from "@/components/add-agent-form"

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-muted-foreground">Manage your agents and their assignments.</p>
        </div>
        <AddAgentForm />
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-t-lg">
          <CardTitle>Agents List</CardTitle>
          <CardDescription className="text-zinc-100">All registered agents in the system</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <AgentsList />
        </CardContent>
      </Card>
    </div>
  )
}
