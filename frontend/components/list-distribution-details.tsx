import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"

interface List {
  id: string
  name: string
  uploadDate: string
  totalLeads: number
  status: string
}

interface Agent {
  id: string
  name: string
  leadsCount: number
  leads: Array<{
    firstName: string
    phone: string
    notes: string
  }>
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

export async function getDistributionData(listId: string): Promise<Agent[]> {
  try {
    console.log('Fetching distribution for list:', listId);
    const response = await fetch(`http://localhost:5000/api/lists/${listId}/distribution`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error:', errorText);
      throw new Error(`Failed to fetch distribution data: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('Received data:', data);
    
    // Transform the data to match our Agent interface
    const agents = data.distribution.map((agent: { agent: { id: string; name: string; email: string }; leads: any[] }) => ({
      id: agent.agent.id,
      name: agent.agent.name,
      leadsCount: agent.leads.length,
      leads: agent.leads.map((lead: { firstName: string; phone: string; notes: string }) => ({
        firstName: lead.firstName,
        phone: lead.phone,
        notes: lead.notes
      }))
    }));
    
    console.log('Transformed agents:', agents);
    return agents;
  } catch (error) {
    console.error('Error fetching distribution data:', error);
    return [];
  }
}

export function ListDistributionDetails({ list }: { list: List }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDistribution = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getDistributionData(list.id)
        setAgents(data)
      } catch (err) {
        setError('Failed to load distribution data')
        console.error('Error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDistribution()
  }, [list.id])

  if (loading) {
    return <div>Loading distribution data...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="space-y-6 py-4">
      <div className="grid grid-cols-5 gap-4">
        {agents.map((agent: Agent) => (
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
        <h3 className="font-medium">Leads Distribution</h3>
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
              {agents.map((agent: Agent) =>
                agent.leads.map((lead: { firstName: string; phone: string; notes: string }, leadIndex: number) => (
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
      </div>
    </div>
  )
}
