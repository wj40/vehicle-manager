"use client"

import { useMemo, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
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
import { Car, Truck, Bus, Motorbike, LoaderIcon, ChevronRight, ChevronLeft, ChevronsLeft, ChevronsRight, ArrowUp, ArrowDown } from "lucide-react"
import type { Vehicle } from "@/types/vehicle"
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

type SortKey = "id" | "brand" | "model" | "productionYear"

type Props = {
  vehicles: Vehicle[]
  searchText: string
}

export function AllVehiclesTable({vehicles, searchText}: Props) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<string>("10")
  const [brandMap, setBrandMap] = useState<Map<number, string>>(new Map())
  const [modelMap, setModelMap] = useState<Map<number, string>>(new Map())
  const [brandsLoading, setBrandsLoading] = useState(true)
  const [modelsLoading, setModelsLoading] = useState(true)

  useEffect(() => {
    getBrands().then((data: {id: number, name: string}[]) => {
      setBrandMap(new Map(data.map(b => [b.id, b.name])))
      setBrandsLoading(false)
    })
  }, [])
  
  const uniqueBrandIds = useMemo(
    () => [...new Set(vehicles.map(v => v.brand_id))],
    [vehicles]
  )

  useEffect(() => {
    if(uniqueBrandIds.length === 0){ 
      setModelsLoading(false)
      return
    }
    Promise.all(uniqueBrandIds.map(id => getModels(id)))
      .then(results => {

        const all = results.flat()
        setModelMap(new Map(all.map(m => [m.id, m.name])))
        setModelsLoading(false)
      })
  }, [uniqueBrandIds])

  const [sortKey, setSortKey] = useState<SortKey | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredSortedVehicles = useMemo(() => {
    let result = [...vehicles]

    if (filterType !== "all") {
      result = result.filter(v => v.type === filterType)
    }

    if (filterStatus !== "all") {
      result = result.filter(v => v.status === filterStatus)
    }

    if ( searchText ) {
      const q = searchText.toLowerCase()
      result = result.filter(V => {
        const brand = (brandMap.get(V.brand_id) ?? "").toLowerCase()
        const model = (modelMap.get(V.model_id) ?? "").toLowerCase()
        const reg = (V.reg_number ?? "").toLowerCase()
        const vin = (V.vin_number ?? "").toLowerCase()
        return brand.includes(q) || model.includes(q) || reg.includes(q) || vin.includes(q)
      })
    }

    if (sortKey) {
      result.sort((a, b) => {
        let cmp = 0
        switch (sortKey) {
          case "id":
            cmp = a.id - b.id
            break
          case "brand":
            cmp = (brandMap.get(a.brand_id) ?? "").localeCompare(brandMap.get(b.brand_id) ?? "", undefined, { sensitivity: "base" })
            break
          case "model":
            cmp = (modelMap.get(a.model_id) ?? "").localeCompare(modelMap.get(b.model_id) ?? "", undefined, { sensitivity: "base" })
            break
          case "productionYear":
            cmp = a.productionYear - b.productionYear
            break
        }
        return sortDir === "asc" ? cmp : -cmp
      })
    }

    return result
  }, [vehicles, filterType, filterStatus, sortKey, sortDir, brandMap, modelMap, searchText])
  
  const totalItems = filteredSortedVehicles.length
  const pageSizeNum = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSizeNum))
  const currentPage = Math.min(page, totalPages)

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * pageSizeNum
    return filteredSortedVehicles.slice(start, start + pageSizeNum)
  }, [filteredSortedVehicles, currentPage, pageSizeNum])

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
  const navigate = useNavigate()

  return (
    
    <div className="mx-5 rounded-xl border bg-card shadow-sm flex flex-col flex-1 min-h-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-5 py-4 shrink-0">
        <div>
          <h2 className="text-sm font-semibold leading-none">All vehicles</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {totalItems} vehicles found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={(v) => { if(v) setFilterType(v)}}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="car">Car</SelectItem>
              <SelectItem value="truck">Truck</SelectItem>
              <SelectItem value="motorcycle">Motorcycle</SelectItem>
              <SelectItem value="bus">Bus</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={(v) => { if(v) setFilterStatus(v)}}>
            <SelectTrigger size="sm" className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="rented">Rented</SelectItem>
              <SelectItem value="service">Service</SelectItem>
            </SelectContent>
          </Select>
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
            <TableHead className="font-semibold text-muted-foreground">Type</TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              <span className={sortableHeadClass} onClick={() => handleSort("brand")}>
                Brand {sortIndicator("brand")}
              </span>
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">
              <span className={sortableHeadClass} onClick={() => handleSort("model")}>
                Model {sortIndicator("model")}
              </span>
            </TableHead>
            <TableHead className="font-semibold text-muted-foreground">Registration</TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground">
              <span className={sortableHeadClass} onClick={() => handleSort("productionYear")}>
                Production Year {sortIndicator("productionYear")}
              </span>
            </TableHead>
            <TableHead className="text-center font-semibold text-muted-foreground">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedVehicles.map((vehicle) => {
            const Icon = typeIcon[vehicle.type] ?? Car
            return (
              <TableRow 
              className="cursor-pointer"
              key={vehicle.id}
              onClick={() => navigate(`/vehicles/${vehicle.id}`)}>
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
                <TableCell className="font-medium">{brandsLoading ? <LoaderIcon className="size-3 animate-spin text-muted-foreground" /> : (brandMap.get(vehicle.brand_id) ?? "-")}</TableCell>
                <TableCell className="text-muted-foreground">{modelsLoading ? <LoaderIcon className="size-3 animate-spin text-muted-foreground" /> : (modelMap.get(vehicle.model_id) ?? "-")}</TableCell>
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