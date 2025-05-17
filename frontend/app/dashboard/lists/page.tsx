import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadListForm } from "@/components/upload-list-form"
import { ListsTable } from "@/components/lists-table"

export default function ListsPage() {
  return (
    <div className="space-y-6">

      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>List</CardTitle>
              <CardDescription className="text-zinc-100">Upload a CSV file to distribute leads to agents</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <UploadListForm />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <ListsTable />
        </CardContent>
      </Card>
    </div>
  )
}
