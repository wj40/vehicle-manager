import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SearchIcon, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown } from "lucide-react"
import { findAllUsers } from "@/lib/api"

type User = {
  id: number
  login: string
  email: string
  role: "ROLE_ADMIN" | "ROLE_USER"
}

const roleVariant: Record<string, "default" | "destructive"> = {
  ROLE_ADMIN: "destructive",
  ROLE_USER: "default",
}

const PAGE_SIZE_OPTIONS = ["5", "10", "25", "50"] as const

type SortKey = "id" | "login" | "email" | "role"

export default function Users() {
  const [searchText, setSearchText] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<string>("10")
  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [users, setUsers] = useState<User[]>([])
  const navigate = useNavigate()
  useEffect(() => {
    findAllUsers().then((data) => {
      setUsers(data)
    })
  }, [])

  const filteredSortedUsers = useMemo(() => {
    let result = [...users]

    if (searchText) {
      const q = searchText.toLowerCase()
      result = result.filter(u => u.login.toLowerCase().includes(q))
    }

    if (sortKey) {
      result.sort((a, b) => {
        let cmp = 0
        switch (sortKey) {
          case "id":
            cmp = a.id - b.id
            break
          case "login":
            cmp = a.login.localeCompare(b.login, undefined, { sensitivity: "base" })
            break
          case "email":
            cmp = a.email.localeCompare(b.email, undefined, { sensitivity: "base" })
            break
          case "role":
            cmp = a.role.localeCompare(b.role, undefined, { sensitivity: "base" })
            break
        }
        return sortDir === "asc" ? cmp : -cmp
      })
    }

    return result
  }, [searchText, sortKey, sortDir, users])

  const totalItems = filteredSortedUsers.length
  const pageSizeNum = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeNum))
  const currentPage = Math.min(page, totalPages)

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSizeNum
    return filteredSortedUsers.slice(start, start + pageSizeNum)
  }, [filteredSortedUsers, currentPage, pageSizeNum])

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSizeNum + 1
  const rangeEnd = Math.min(currentPage * pageSizeNum, totalItems)

  function handlePageSizeChange(value: string | null) {
    if (!value) return
    setPageSize(value)
    setPage(1)
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") {
        setSortDir("desc")
      } else {
        setSortKey(null)
      }
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  function sortIndicator(columnKey: SortKey) {
    if (sortKey !== columnKey) return null
    return sortDir === "asc" ? <ArrowUp className="ml-0.5 inline size-3.5" /> : <ArrowDown className="ml-0.5 inline size-3.5" />
  }

  const sortableHeadClass = "cursor-pointer select-none inline-flex items-center hover:text-foreground transition-colors"

  return (
    <SidebarInset>
      <SiteHeader title="Users" />
      <div className="flex flex-1 flex-col min-h-0">
        <div className="@container/main flex flex-1 flex-col min-h-0">
          <div className="flex flex-col gap-4 py-2 md:py-4 flex-1 min-h-0">
            <div className="mx-5 rounded-xl border bg-card shadow-sm">
              <div className="flex items-center gap-2 border-b px-5 py-4">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SearchIcon className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold leading-none">Search users</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Find a user by login
                  </p>
                </div>
              </div>
              <div className="p-5">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by login..."
                    value={searchText}
                    onChange={(e) => { setSearchText(e.target.value); setPage(1) }}
                    className="h-11 pl-9 text-[15px]"
                  />
                </div>
              </div>
            </div>

            <div className="mx-5 rounded-xl border bg-card shadow-sm flex flex-col flex-1 min-h-0">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4 shrink-0">
                <div>
                  <h2 className="text-sm font-semibold leading-none">All users</h2>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {totalItems} users found
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-auto min-h-0">
                <Table>
                  <TableHeader className="sticky top-0 z-10 bg-background">
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-20 font-semibold text-muted-foreground">
                        <span className={sortableHeadClass} onClick={() => handleSort("id")}>
                          ID {sortIndicator("id")}
                        </span>
                      </TableHead>
                      <TableHead className="font-semibold text-muted-foreground">
                        <span className={sortableHeadClass} onClick={() => handleSort("login")}>
                          Login {sortIndicator("login")}
                        </span>
                      </TableHead>
                      <TableHead className="font-semibold text-muted-foreground">
                        <span className={sortableHeadClass} onClick={() => handleSort("email")}>
                          Email {sortIndicator("email")}
                        </span>
                      </TableHead>
                      <TableHead className="font-semibold text-muted-foreground">
                        <span className={sortableHeadClass} onClick={() => handleSort("role")}>
                          Role {sortIndicator("role")}
                        </span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow
                      className="cursor-pointer"
                      key={user.id}
                      onClick={() => navigate(`/user/${user.id}`)}
                      >
                        <TableCell className="font-medium text-muted-foreground">
                          #{user.id}
                        </TableCell>
                        <TableCell className="font-medium">{user.login}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={roleVariant[user.role] ?? "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex flex-col gap-3 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Rows per page</span>
                  <Select value={pageSize} onValueChange={handlePageSizeChange}>
                    <SelectTrigger size="sm" className="w-17.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PAGE_SIZE_OPTIONS.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="hidden sm:inline">
                    &middot; Showing {rangeStart}-{rangeEnd} of {totalItems}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <span className="mr-2 text-xs text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={currentPage === 1}
                    onClick={() => setPage(1)}
                    aria-label="First page"
                  >
                    <ChevronsLeft className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={currentPage === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    aria-label="Next page"
                  >
                    <ChevronRight className="size-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="size-7"
                    disabled={currentPage === totalPages}
                    onClick={() => setPage(totalPages)}
                    aria-label="Last page"
                  >
                    <ChevronsRight className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
