"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { FileSpreadsheet, Home, Users } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Agents",
    href: "/dashboard/agents",
    icon: Users,
  },
  {
    title: "Lists",
    href: "/dashboard/lists",
    icon: FileSpreadsheet,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:block w-64 border-r bg-gradient-to-b from-violet-50 to-indigo-50 dark:from-slate-950 dark:to-indigo-950 p-4">
      <div className="space-y-2">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              "w-full justify-start gap-2 font-normal",
              pathname === item.href &&
                "bg-gradient-to-r from-violet-500 to-indigo-500 text-white hover:from-violet-600 hover:to-indigo-600 hover:text-white",
            )}
          >
            <Link href={item.href}>
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          </Button>
        ))}
      </div>
    </nav>
  )
}
