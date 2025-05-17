"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AgentsList } from "@/components/agents-list"
import { AddAgentForm } from "@/components/add-agent-form"

export default function AgentsPage() {
  const agentsListRef = useRef<{ fetchAgents: () => Promise<void> } | null>(null);

  const handleAgentAdded = () => {
    // Refresh the agents list when a new agent is added
    if (agentsListRef.current) {
      agentsListRef.current.fetchAgents();
    }
  };

  return (
    <div className="space-y-6">

      <Card>
        <CardHeader className="bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agents</h1>
          <p className="text-zinc-100d">All registered agents in the system</p>
        </div>
        <AddAgentForm onAgentAdded={handleAgentAdded} />
      </div>
        </CardHeader>
        <CardContent className="pt-6">
          <AgentsList ref={agentsListRef} />
        </CardContent>
      </Card>
    </div>
  )
}
