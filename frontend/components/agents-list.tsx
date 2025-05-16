"use client"

import { useState, useEffect } from "react"
import { Edit, MoreHorizontal, Trash, RefreshCw } from "lucide-react"

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

// Define agent type
interface Agent {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  leadsCount?: number;
}

export function AgentsList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch agents from the backend
  const fetchAgents = async () => {
    try {
      setLoading(true);
      console.log('Fetching agents from backend');
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to view agents",
          variant: "destructive"
        });
        return;
      }
      
      const response = await fetch("http://localhost:5000/api/agents", {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      });
      
      console.log('Agents API response status:', response.status);
      
      const data = await response.json();
      console.log('Agents API response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch agents');
      }
      
      // Add a default leadsCount property if it doesn't exist
      const agentsWithLeadCount = data.map((agent: Agent) => ({
        ...agent,
        leadsCount: agent.leadsCount || 0
      }));
      
      setAgents(agentsWithLeadCount);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch agents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete an agent
  const handleDeleteAgent = async (id: string) => {
    try {
      console.log('Deleting agent with ID:', id);
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to delete agents",
          variant: "destructive"
        });
        return;
      }
      
      const response = await fetch(`http://localhost:5000/api/agents/${id}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      });
      
      console.log('Delete agent API response status:', response.status);
      
      const data = await response.json();
      console.log('Delete agent API response data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete agent');
      }
      
      // Update the local state
      setAgents(agents.filter((agent) => agent._id !== id));
      
      toast({
        title: "Agent deleted",
        description: "The agent has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting agent:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete agent",
        variant: "destructive"
      });
    }
  };
  
  // Fetch agents when component mounts
  useEffect(() => {
    fetchAgents();
  }, []);

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={fetchAgents} 
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Agents'}
        </Button>
      </div>
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
          {loading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">Loading agents...</TableCell>
            </TableRow>
          ) : agents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">No agents found</TableCell>
            </TableRow>
          ) : (
            agents.map((agent) => (
              <TableRow key={agent._id}>
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
                      <DropdownMenuItem onClick={() => handleDeleteAgent(agent._id)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}
