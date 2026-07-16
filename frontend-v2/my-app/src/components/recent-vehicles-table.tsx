import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "./ui/badge"
import { type Vehicle } from "@/types/vehicle"
import { getBrands, getModels } from "@/lib/api"

type RecentVehiclesTableProps = {
  vehicles: Vehicle[]
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

export function RecentVehiclesTable({vehicles}: RecentVehiclesTableProps) {
  const [brandMap, setBrandMap] = useState<Map<number, string>>(new Map())
  const [modelMap, setModelMap] = useState<Map<number, string>>(new Map())
  
  useEffect(() => {
  getBrands().then((data: {id: number, name: string}[]) => setBrandMap(new Map(data.map(b => [b.id, b.name]))))    }, [])
    
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

  const navigate = useNavigate()
  
  return (
    <div className="rounded-xl border bg-card">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold leading-none">Recently added</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Latest {vehicles.length} vehicles</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-25">ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Model</TableHead>
            <TableHead className="text-right">Production Year</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow 
            key={vehicle.id}
            onClick={() => navigate(`/vehicles/${vehicle.id}`)}
            className="cursor-pointer"
            >
              <TableCell className="font-medium">{vehicle.id}</TableCell>
              <TableCell>{vehicle.type}</TableCell>
              <TableCell>{brandMap.get(vehicle.brand_id) ?? vehicle.brand_id}</TableCell>
              <TableCell>{modelMap.get(vehicle.model_id) ?? vehicle.brand_id}</TableCell>
              <TableCell className="text-right">{vehicle.productionYear}</TableCell>
              <TableCell className="text-right">
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
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
