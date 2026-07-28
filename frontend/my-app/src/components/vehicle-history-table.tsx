import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type VehicleHistory } from "@/types/history"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react"

const PAGE_SIZE_OPTIONS = ["5", "10", "25", "50"] as const

type VehicleHistoryTableProps = {
  history: VehicleHistory[]
}

export function VehicleHistoryTable({history}: VehicleHistoryTableProps) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<string>("10")
  
  const totalItems = history.length
  const pageSizeNum = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeNum))
  const currentPage = Math.min(page, totalPages)

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSizeNum
    return history.slice(start, start + pageSizeNum)
  }, [history, currentPage, pageSizeNum])
  
  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSizeNum + 1
  const rangeEnd = Math.min(currentPage * pageSizeNum, totalItems)
  
  function handlePageSizeChange(value: string | null) {
    if (!value) return
    setPageSize(value)
    setPage(1)
  }
  return (
    <div className="rounded-xl border bg-card shadow-sm flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between border-b px-5 py-4 shrink-0">
            <div>
              <h2 className="text-sm font-semibold leading-none">All vehicles</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                {totalItems} vehicles found
              </p>
            </div>
          </div>
    
          <div className="flex-1 overflow-auto min-h-0">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-background">
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                <TableHead className="font-semibold text-muted-foreground w-[25%]">Action</TableHead>
                <TableHead className="font-semibold text-muted-foreground w-[25%]">Old status</TableHead>
                <TableHead className="font-semibold text-muted-foreground w-[25%]">New status</TableHead>
                <TableHead className="font-semibold text-muted-foreground w-[25%]">Changed at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedVehicles.map((history) => {
                return (
                  <TableRow key={history.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      {history.action}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{history.old_status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{history.new_status}</TableCell>
                    <TableCell className="text-muted-foreground">{history.changed_at}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </div>
    
          <div className="flex flex-col gap-3 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Rows per page</span>
              <Select value={pageSize} onValueChange={handlePageSizeChange}>
                <SelectTrigger size="sm" className="w-[70px]">
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
  )
}