import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { API_BASE_URL } from "@/lib/config"

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


export async function getDistributionData(listId: string): Promise<Agent[]> {
  try {
    console.log('Fetching distribution for list:', listId);
    const response = await fetch(`${API_BASE_URL}/api/lists/${listId}/distribution`, {
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
  } catch (err) {
    console.error('Error fetching distribution data:', err);
    return [];
  }
}

import { ChevronDown, ChevronUp } from "lucide-react"

export function ListDistributionDetails({ list }: { list: List }) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)

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
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <div className="text-red-700 font-medium">Error</div>
        <p className="text-red-600 text-sm mt-2">{error}</p>
      </div>
    )
  }

  if (agents.length === 0) {
    return (
      <div className="p-6 bg-slate-50 border border-slate-200 rounded-lg">
        <div className="text-slate-700 font-medium">No Distribution</div>
        <p className="text-slate-600 text-sm mt-2">No leads have been distributed yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agents Distribution</h2>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                selectedAgent === agent.id
                  ? 'bg-violet-50 dark:bg-violet-900/20 border-l-4 border-violet-500'
                  : 'hover:bg-gray-50 dark:hover:bg-slate-700/50'
              }`}
              onClick={() => setSelectedAgent(selectedAgent === agent.id ? null : agent.id)}
            >
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">{agent.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{agent.leadsCount} Leads</p>
                </div>
              </div>
              {selectedAgent === agent.id ? (
                <ChevronUp className="h-5 w-5 text-violet-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedAgent && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {agents.find(a => a.id === selectedAgent)?.name}'s Leads
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {agents.find(a => a.id === selectedAgent)?.leadsCount} Leads
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-y-auto max-h-[400px]">
              <Table className="w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 py-3">
                      First Name
                    </TableHead>
                    <TableHead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 py-3">
                      Phone
                    </TableHead>
                    <TableHead className="bg-gray-50 dark:bg-slate-700 text-gray-500 dark:text-gray-300 py-3">
                      Notes
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agents.find(a => a.id === selectedAgent)?.leads.map((lead, leadIndex) => (
                    <TableRow
                      key={leadIndex}
                      className="hover:bg-gray-50 dark:hover:bg-slate-700/50"
                    >
                      <TableCell className="py-4">{lead.firstName}</TableCell>
                      <TableCell className="py-4">{lead.phone}</TableCell>
                      <TableCell className="py-4">{lead.notes}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
