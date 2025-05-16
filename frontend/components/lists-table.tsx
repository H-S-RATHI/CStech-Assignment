"use client"

import { useState } from "react"
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

// Mock data for lists
const initialLists = [
  {
    id: "1",
    name: "Marketing Leads Q2.csv",
    uploadDate: "May 15, 2025",
    totalLeads: 125,
    status: "Distributed",
  },
  {
    id: "2",
    name: "Sales Leads Q2.csv",
    uploadDate: "May 13, 2025",
    totalLeads: 75,
    status: "Distributed",
  },
  {
    id: "3",
    name: "Support Leads Q2.csv",
    uploadDate: "May 10, 2025",
    totalLeads: 50,
    status: "Distributed",
  },
]

export function ListsTable() {
  const [lists, setLists] = useState(initialLists)
  const [selectedList, setSelectedList] = useState<(typeof initialLists)[0] | null>(null)
  const [showDistribution, setShowDistribution] = useState(false)
  const { toast } = useToast()

  const handleDeleteList = (id: string) => {
    setLists(lists.filter((list) => list.id !== id))
    toast({
      title: "List deleted",
      description: "The list has been deleted successfully",
    })
  }

  const handleViewDistribution = (list: (typeof initialLists)[0]) => {
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
            {lists.map((list) => (
              <TableRow key={list.id}>
                <TableCell className="font-medium">{list.name}</TableCell>
                <TableCell>{list.uploadDate}</TableCell>
                <TableCell>{list.totalLeads}</TableCell>
                <TableCell>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500">{list.status}</Badge>
                </TableCell>
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
                      <DropdownMenuItem onClick={() => handleViewDistribution(list)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Distribution
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteList(list.id)}>
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
