"use client"

import { useState } from "react"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

// Mock data for agents
const initialAgents = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    mobile: "+1 (555) 123-4567",
    leadsCount: 25,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    mobile: "+1 (555) 234-5678",
    leadsCount: 25,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael.brown@example.com",
    mobile: "+1 (555) 345-6789",
    leadsCount: 25,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    mobile: "+1 (555) 456-7890",
    leadsCount: 25,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david.wilson@example.com",
    mobile: "+1 (555) 567-8901",
    leadsCount: 25,
  },
]

export function AgentsList() {
  const [agents, setAgents] = useState(initialAgents)
  const { toast } = useToast()

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
    toast({
      title: "Agent deleted",
      description: "The agent has been deleted successfully",
    })
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Assigned Leads</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {agents.map((agent) => (
            <TableRow key={agent.id}>
              <TableCell className="font-medium">{agent.name}</TableCell>
              <TableCell>{agent.email}</TableCell>
              <TableCell>{agent.mobile}</TableCell>
              <TableCell>{agent.leadsCount}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDeleteAgent(agent.id)}>
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
