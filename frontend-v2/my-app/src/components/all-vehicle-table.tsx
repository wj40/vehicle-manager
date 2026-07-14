"use client"

import { useMemo, useState, useEffect, Fragment } from "react"
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
import { Car, Truck, Bus, Motorbike, ChevronDown, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight } from "lucide-react"
import type { Vehicle } from "@/types/vehicle"
import { VehicleActionCards } from "./vehicle-action-cards"
import { getBrands, getModels } from "@/lib/api"


const typeIcon: Record<string, React.ElementType> = {
  car: Car,
  truck: Truck,
  motorcycle: Motorbike,
  bus: Bus
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  available: "default",
  service: "destructive",
  rented: "secondary",
}

const statusDot: Record<string, string> = {
  available: "bg-emerald-500",
  service: "bg-red-500",
  rented: "bg-amber-500",
}

const PAGE_SIZE_OPTIONS = ["5", "10", "25", "50"] as const

type Props = {
  vehicles: Vehicle[]
  onAction: (vehicleId: number, actionType: string) => void
  expandedId: number | null
  onToggleExpand: (vehicleId: number | null) => void
}

export function AllVehiclesTable({vehicles, onAction, expandedId, onToggleExpand}: Props) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<string>("10")
  const [brandMap, setBrandMap] = useState<Map<number, string>>(new Map())
  const [modelMap, setModelMap] = useState<Map<number, string>>(new Map())

  useEffect(() => {
    getBrands().then((data: {id: number, name: string}[]) => setBrandMap(new Map(data.map(b => [b.id, b.name]))))
  }, [])
  
  const uniqueBrandIds = useMemo(
    () => [...new Set(vehicles.map(v => v.brand_id))],
    [vehicles]
  )

  useEffect(() => {
    if(uniqueBrandIds.length === 0) return
    Promise.all(uniqueBrandIds.map(id => getModels(id)))
      .then(results => {

        const all = results.flat()
        setModelMap(new Map(all.map(m => [m.id, m.name])))
      })
  }, [uniqueBrandIds])

  const totalItems = vehicles.length
  const pageSizeNum = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeNum))
  const currentPage = Math.min(page, totalPages)

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSizeNum
    return vehicles.slice(start, start + pageSizeNum)
  }, [vehicles, currentPage, pageSizeNum])

  const rangeStart = totalItems === 0 ? 0 : (currentPage - 1) * pageSizeNum + 1
  const rangeEnd = Math.min(currentPage * pageSizeNum, totalItems)

  function handlePageSizeChange(value: string | null) {
    if (!value) return
    setPageSize(value)
    setPage(1)
  }

  return (
    
    <div className="mx-5 rounded-xl border bg-card shadow-sm flex flex-col flex-1 min-h-0">
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
            <TableHead className="w-20 font-semibold text-muted-foreground">ID</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Type</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Brand</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Model</TableHead>
            <TableHead className="font-semibold text-muted-foreground">Registration</TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground">Production Year</TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground">Status</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedVehicles.map((vehicle) => {
            const Icon = typeIcon[vehicle.type] ?? Car
            return (
              <Fragment key={vehicle.id}>
              <TableRow className="cursor-pointer">
                <TableCell className="font-medium text-muted-foreground">
                  #{vehicle.id}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="font-medium">{vehicle.type}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{brandMap.get(vehicle.brand_id) ?? vehicle.brand_id}</TableCell>
                <TableCell className="text-muted-foreground">{modelMap.get(vehicle.model_id) ?? vehicle.brand_id}</TableCell>
                <TableCell>
                  <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs tracking-wider">
                    {vehicle.reg_number}
                  </span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground">
                  {vehicle.productionYear}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={statusVariant[vehicle.status] ?? "outline"}
                    className="capitalize"
                  >
                    <span
                      className={`size-1.5 rounded-full ${statusDot[vehicle.status] ?? "bg-muted-foreground"}`}
                    />
                    {vehicle.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                  variant="ghost"
                  size="icon"
                  className="size-7"
                  onClick={() => onToggleExpand(expandedId === vehicle.id ? null : vehicle.id)}
                  >
                    {expandedId === vehicle.id
                      ? <ChevronDown />
                      : <ChevronRight />
                    }
                  </Button>
                </TableCell>
              </TableRow>
              {expandedId === vehicle.id && (
                <TableRow key={`${vehicle.id}-expanded`}>
                  <TableCell colSpan={8} className="bg-muted/20 p-4">
                    <VehicleActionCards onAction={(actionType) => {
                      onAction(vehicle.id, actionType)
                    }}/>
                  </TableCell>
                </TableRow>
              )}
              </Fragment>
            )
          })}
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
  )
}