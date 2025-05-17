"use client"

import { useEffect, useState } from "react"
import { User } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
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
    console.log("Fetching distribution for list:", listId)
    const response = await fetch(`${API_BASE_URL}/api/lists/${listId}/distribution`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })

    console.log("Response status:", response.status)
    if (!response.ok) {
      const errorText = await response.text()
      console.error("Response error:", errorText)
      throw new Error(`Failed to fetch distribution data: ${errorText}`)
    }

    const data = await response.json()
    console.log("Received data:", data)

    // Transform the data to match our Agent interface
    const agents = data.distribution.map(
      (agent: { agent: { id: string; name: string; email: string }; leads: any[] }) => ({
        id: agent.agent.id,
        name: agent.agent.name,
        leadsCount: agent.leads.length,
        leads: agent.leads.map((lead: { firstName: string; phone: string; notes: string }) => ({
          firstName: lead.firstName,
          phone: lead.phone,
          notes: lead.notes,
        })),
      }),
    )

    console.log("Transformed agents:", agents)
    return agents
  } catch (err) {
    console.error("Error fetching distribution data:", err)
    return []
  }
}

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
        if (data.length > 0) {
          setSelectedAgent(data[0].id) // Select the first agent by default
        }
      } catch (err) {
        setError("Failed to load distribution data")
        console.error("Error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDistribution()
  }, [list.id])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-3 border-violet-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="text-red-700 font-medium text-base">Error</div>
          <p className="text-red-600 mt-1 text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (agents.length === 0) {
    return (
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-4">
          <div className="text-slate-700 font-medium text-base">No Distribution</div>
          <p className="text-slate-600 mt-1 text-sm">No leads have been distributed yet</p>
        </CardContent>
      </Card>
    )
  }

  // Find the selected agent data
  const selectedAgentData = agents.find(agent => agent.id === selectedAgent) || agents[0];

  return (
    <div className="space-y-4 w-4/5 mx-auto">
      <Card className="shadow-sm">
        <CardHeader className="pb-2 pt-3">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <span className="bg-violet-100 dark:bg-violet-900/30 p-1 rounded-md">
              <User className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            </span>
            Agents Distribution
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {/* Excel-like tabs for agents */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-2">
            <div className="flex overflow-x-auto">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`py-2 px-4 text-xs cursor-pointer whitespace-nowrap flex items-center gap-1
                    ${selectedAgent === agent.id
                      ? "border-b-2 border-violet-500 text-violet-700 dark:text-violet-400 font-medium"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300"
                    }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="h-5 w-5 rounded-full bg-gradient-to-r from-violet-500 to-indigo-500 flex items-center justify-center text-white text-xs font-medium">
                    {agent.name.charAt(0)}
                  </div>
                  <span>{agent.name}</span>
                  <Badge variant={agent.leadsCount > 0 ? "default" : "outline"} className="ml-1 text-xs py-0 h-4">
                    {agent.leadsCount}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Data table for the selected agent */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
            <ScrollArea className="h-[400px] w-full">
              <Table>
                <TableHeader className="sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="bg-gray-50 dark:bg-slate-800 font-medium text-xs w-1/4">First Name</TableHead>
                    <TableHead className="bg-gray-50 dark:bg-slate-800 font-medium text-xs w-1/4">Phone</TableHead>
                    <TableHead className="bg-gray-50 dark:bg-slate-800 font-medium text-xs w-2/4">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedAgentData.leads.length > 0 ? (
                    selectedAgentData.leads.map((lead, index) => (
                      <TableRow key={index} className="text-xs">
                        <TableCell className="py-2">{lead.firstName}</TableCell>
                        <TableCell className="py-2">{lead.phone}</TableCell>
                        <TableCell className="py-2">{lead.notes}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500 text-xs">
                        No leads assigned to this agent
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}