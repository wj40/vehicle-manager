"use client"

import { Avatar } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { UserCircle } from "lucide-react"

interface UserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: UserProps) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <Avatar className="h-8 w-8 rounded-lg grayscale overflow-hidden">
            <UserCircle className="h-full w-full" style={{ width: '100%', height: '100%' }}/>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
