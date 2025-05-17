// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// export function RecentActivity() {
//   const activities = [
//     {
//       action: "List uploaded",
//       description: "Marketing Leads Q2.csv",
//       time: "2 hours ago",
//     },
//     {
//       action: "Agent added",
//       description: "John Smith",
//       time: "5 hours ago",
//     },
//     {
//       action: "List distributed",
//       description: "25 leads distributed to 5 agents",
//       time: "5 hours ago",
//     },
//     {
//       action: "Agent updated",
//       description: "Sarah Johnson",
//       time: "Yesterday",
//     },
//     {
//       action: "List uploaded",
//       description: "Sales Leads Q2.csv",
//       time: "2 days ago",
//     },
//   ]

//   return (
//     <Card>
//       <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-t-lg">
//         <CardTitle>Recent Activity</CardTitle>
//         <CardDescription className="text-zinc-100">Latest actions in the system</CardDescription>
//       </CardHeader>
//       <CardContent className="pt-6">
//         <div className="space-y-4">
//           {activities.map((activity, index) => (
//             <div key={index} className="flex items-start gap-3">
//               <div className="h-2 w-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mt-2" />
//               <div>
//                 <p className="font-medium">{activity.action}</p>
//                 <p className="text-sm text-muted-foreground">{activity.description}</p>
//                 <p className="text-xs text-muted-foreground">{activity.time}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </CardContent>
//     </Card>
//   )
// }
