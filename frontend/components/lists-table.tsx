"use client"

import { useState, useEffect } from "react"
import { Download, Eye, MoreHorizontal, Trash } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ListDistributionDetails } from "@/components/list-distribution-details"
import { API_BASE_URL } from "@/lib/config"

// Define List type
interface List {
  _id: string;
  id: string;
  name: string;
  uploadDate: string;
  totalLeads: number;
  status: string;
}


declare global {
  interface Window {
    refreshLists: () => Promise<void>
  }
}

export function ListsTable() {
  const [lists, setLists] = useState<List[]>([])
  const [selectedList, setSelectedList] = useState<List | null>(null)
  const [showDistribution, setShowDistribution] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  // Function to refresh lists
  const refreshLists = async () => {
    await fetchLists()
  }

  // Expose refresh function only on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.refreshLists = refreshLists
    }
  }, [refreshLists])

  // Fetch lists from backend
  const fetchLists = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to view lists",
          variant: "destructive"
        })
        return
      }

      const response = await fetch(`${API_BASE_URL}/api/lists`, {
        method: "GET",
        headers: { 
          "Authorization": `Bearer ${token}`
        },
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch lists')
      }

      // Convert _id to id for each list
      const formattedLists = data.map((list: any) => ({
        ...list,
        id: list._id.toString(),
        uploadDate: new Date(list.uploadDate).toLocaleDateString('en-IN')
      }))

      setLists(formattedLists)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch lists",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete list
  const handleDeleteList = async (id: string) => {
    console.log('Starting delete process for _id:', id);
    console.log('_id type:', typeof id);
    console.log('_id value:', id);
    try {
      // Validate ID format
      if (!id || typeof id !== 'string' || !id.trim()) {
        console.log('ID validation failed');
        throw new Error('Invalid list ID');
      }

      const token = localStorage.getItem('token')
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to delete lists",
          variant: "destructive"
        })
        return
      }

      // Make the delete request
      console.log('Making delete request with _id:', id);
      const response = await fetch(`${API_BASE_URL}/api/lists/${encodeURIComponent(id)}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json()
        console.log('Error data:', errorData);
        throw new Error(errorData.message || 'Failed to delete list')
      }

      // Get the deleted list data from response
      const data = await response.json()
      console.log('Delete response data:', data);
      
      // Refresh the lists to show the updated state
      await refreshLists()
      
      // Show success toast with deleted list info
      toast({
        title: "List deleted",
        description: `Successfully deleted list: ${data.deletedList.name} (${data.deletedList.totalLeads} leads)`,
      })
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete list",
        variant: "destructive"
      })
    }
  }

  // Fetch lists when component mounts
  useEffect(() => {
    fetchLists()
  }, [])

  const handleViewDistribution = (list: List) => {
    setSelectedList(list)
    setShowDistribution(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>File Name</TableHead>
              <TableHead>Upload Date</TableHead>
              <TableHead>Total Leads</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {lists.map((list) => {
                console.log('Current list:', list);
                
                const handleDelete = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  console.log('Attempting to delete list:', list);
                  console.log('List _id type:', typeof list._id);
                  console.log('List _id value:', list._id);
                  const confirmDelete = window.confirm('Are you sure you want to delete this list?');
                  if (confirmDelete) {
                    console.log('Confirmed delete for list _id:', list._id);
                    handleDeleteList(list._id);
                  }
                };

                return (
                  <TableRow key={list.id}>
                    <TableCell className="font-medium">{list.name}</TableCell>
                    <TableCell>{list.uploadDate}</TableCell>
                    <TableCell>{list.totalLeads}</TableCell>
                    <TableCell>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">{list.status}</Badge>
                    </TableCell>
                    <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleViewDistribution(list)}
                            className="hover:bg-violet-50 dark:hover:bg-violet-900/20"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View distribution for {list.name}</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete list {list.name}</span>
                          </Button>
                        </div>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDistribution} onOpenChange={setShowDistribution}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>List Distribution Details</DialogTitle>
            <DialogDescription>
              {selectedList?.name} - {selectedList?.totalLeads} leads distributed to 5 agents
            </DialogDescription>
          </DialogHeader>
          {selectedList && <ListDistributionDetails list={selectedList} />}
        </DialogContent>
      </Dialog>
    </>
  )
}
