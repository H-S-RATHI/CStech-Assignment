import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type List = {
  id: string
  name: string
  uploadDate: string
  totalLeads: number
  status: string
}

type Agent = {
  id: string
  name: string
  leadsCount: number
  leads: {
    firstName: string
    phone: string
    notes: string
  }[]
}

// Mock data for distribution
const generateMockDistribution = (list: List): Agent[] => {
  const agents: Agent[] = [
    { id: "1", name: "John Smith", leadsCount: 0, leads: [] },
    { id: "2", name: "Sarah Johnson", leadsCount: 0, leads: [] },
    { id: "3", name: "Michael Brown", leadsCount: 0, leads: [] },
    { id: "4", name: "Emily Davis", leadsCount: 0, leads: [] },
    { id: "5", name: "David Wilson", leadsCount: 0, leads: [] },
  ]

  // Calculate leads per agent
  const leadsPerAgent = Math.floor(list.totalLeads / agents.length)
  const remainder = list.totalLeads % agents.length

  // Distribute leads
  agents.forEach((agent, index) => {
    const extraLead = index < remainder ? 1 : 0
    agent.leadsCount = leadsPerAgent + extraLead

    // Generate mock leads
    for (let i = 0; i < agent.leadsCount; i++) {
      agent.leads.push({
        firstName: `Lead ${i + 1}`,
        phone: `+1 (555) ${100 + i}-${1000 + i}`,
        notes: `Note for lead ${i + 1}`,
      })
    }
  })

  return agents
}

export function ListDistributionDetails({ list }: { list: List }) {
  const agents = generateMockDistribution(list)

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-5 gap-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-medium">
              {agent.id}
            </div>
            <h3 className="mt-2 font-medium text-center">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.leadsCount} leads</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Sample Leads Distribution</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>First Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) =>
                agent.leads.slice(0, 2).map((lead, leadIndex) => (
                  <TableRow key={`${agent.id}-${leadIndex}`}>
                    <TableCell>{agent.name}</TableCell>
                    <TableCell>{lead.firstName}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.notes}</TableCell>
                  </TableRow>
                )),
              )}
            </TableBody>
          </Table>
        </div>
        <p className="text-sm text-muted-foreground">
          Showing sample leads. Each agent has {agents[0]?.leadsCount} leads in total.
        </p>
      </div>
    </div>
  )
}
