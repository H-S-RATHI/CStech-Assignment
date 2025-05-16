import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadListForm } from "@/components/upload-list-form"
import { ListsTable } from "@/components/lists-table"

export default function ListsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Lists</h1>
        <p className="text-muted-foreground">Upload and distribute lists to your agents.</p>
      </div>

      <Card>
        <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-t-lg">
          <CardTitle>Upload New List</CardTitle>
          <CardDescription className="text-zinc-100">Upload a CSV file to distribute leads to agents</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <UploadListForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
          <CardTitle>Uploaded Lists</CardTitle>
          <CardDescription className="text-zinc-100">All lists uploaded and distributed in the system</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ListsTable />
        </CardContent>
      </Card>
    </div>
  )
}
