import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AllVehiclesTable } from "@/components/all-vehicle-table"
import {
  SidebarInset,

} from "@/components/ui/sidebar"
import SearchVehicleForm from "@/components/search-vehicle-form"
import { findAll } from "@/lib/api"
import { type Vehicle } from "@/types/vehicle"


export default function Search() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [clearCounter, setClearCounter] = useState(0)
  const [refreshKey, setRefreshKey] = useState(0)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    findAll().then((data) => {
      setVehicles(data)
      setFilteredVehicles(data)
    })
  }, [refreshKey])

  function handleSelect(vehicle: Vehicle) {
    setFilteredVehicles([vehicle])
  }

  function handleClear() {
  setFilteredVehicles(vehicles)
  setSearchText("")
  setClearCounter(c => c + 1)
  }

  return (
      <SidebarInset>
        <SiteHeader 
        title="Search vehicles"
        />
        <div className="flex flex-1 flex-col min-h-0">
          <div className="@container/main flex flex-1 flex-col min-h-0">
            <div className="flex flex-col gap-4 py-2 md:py-4 flex-1 min-h-0">
              <SearchVehicleForm 
              vehicles={vehicles}
              onSelect={handleSelect}
              onClear={handleClear}
              searchText={searchText}
              onSearchTextChange={setSearchText}
              key={clearCounter}
              />
              <AllVehiclesTable 
              vehicles={filteredVehicles}
              searchText={searchText}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
  )
}
