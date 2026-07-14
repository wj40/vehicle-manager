import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AllVehiclesTable } from "@/components/all-vehicle-table"
import {
  SidebarInset,

} from "@/components/ui/sidebar"
import { toast } from "sonner"
import SearchVehicleForm from "@/components/search-vehicle-form"
import { findAll } from "@/lib/api"
import { type Vehicle } from "@/types/vehicle"
import { manage, deleteVehicle } from "@/lib/api"


export default function Search() {

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])
  const [clearCounter, setClearCounter] = useState(0)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    findAll().then((data) => {
      setVehicles(data)
      setFilteredVehicles(data)
    })
  }, [refreshKey])

  function handleSelect(vehicle: Vehicle) {
    setFilteredVehicles([vehicle])
    setSelectedId(vehicle.id)
  }

  function handleClear() {
  setFilteredVehicles(vehicles)
  setClearCounter(c => c + 1)
  }

  function handleToogleExpand(vehicleId: number | null){
    setExpandedId(vehicleId)
  }

  function handleManageButton(vehicleId: number, actionType: string){
        if(actionType == "delete"){
            deleteVehicle(vehicleId)
            .then((data) => toast.success(data.message))
            .then(() => setRefreshKey(k => k + 1))
            .catch((error) => toast.error(error.message))
        }else{
            let actionMessage = ""
            switch(actionType){
              case "rent": 
              actionMessage = "Vehicle rented succesfully"
              break;

              case "return": 
              actionMessage = "Vehicle returned succesfully"
              break;

              case "service": 
              actionMessage = "Vehicle sent to service succesfully"
              break;

              case "finish-service": 
              actionMessage = "Vehicle returned from service succesfully"
              break;

              default: actionMessage = "Error"
            }
            manage(vehicleId, actionType)
            .then(() => toast.success(actionMessage))
            .then(() => setRefreshKey(k => k + 1))
            .catch((error) => toast.error(error.message))
      }
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
              key={clearCounter}
              />
              <AllVehiclesTable 
              vehicles={filteredVehicles}
              expandedId={expandedId}
              onToggleExpand={handleToogleExpand}
              onAction={handleManageButton}
              />
            </div>
          </div>
        </div>
      </SidebarInset>
  )
}
