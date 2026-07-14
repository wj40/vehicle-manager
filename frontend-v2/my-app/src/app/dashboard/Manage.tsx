import { useEffect, useState, useMemo } from "react"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
} from "@/components/ui/sidebar"
import { VehicleActionCards } from "@/components/vehicle-action-cards"
import { VehicleHistoryTable } from "@/components/vehicle-history-table"
import { toast } from "sonner"
import { type VehicleHistory } from "@/types/history"
import { findById, history } from "@/lib/api"
import SearchVehicleForm from "@/components/search-vehicle-form"
import { type Vehicle } from "@/types/vehicle"
import { findAll } from "@/lib/api"
import { VehicleRegisterPreview, type VehicleFormData } from "@/components/vehicle-register-preview"
import { manage, deleteVehicle, getBrands, getModels } from "@/lib/api"

export default function Manage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleFormData | null>(null)
  const [clearCounter, setClearCounter] = useState(0)
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

    useEffect(() => {
      findAll().then((data) => {
        setVehicles(data)
      })
    }, [])
  
    function handleSelect(vehicle: Vehicle) {
      setSelectedId(vehicle.id)
      setSelectedVehicle(null)
      setSelectedVehicle({
      type: vehicle.type,
      brand: brandMap.get(vehicle.brand_id) ?? String(vehicle.brand_id),
      model: modelMap.get(vehicle.model_id) ?? String(vehicle.model_id),
      brandId: String(vehicle.brand_id),
      modelId: String(vehicle.model_id),
      regNumber: vehicle.reg_number,
      vinNumber: vehicle.vin_number,
      productionYear: vehicle.productionYear.toString(),
      status: vehicle.status,
    })
    }
  
    function handleClear() {
    setSelectedVehicle(null)
    setSelectedId(null)
    setHistory([])
    setClearCounter(c => c + 1) 
    }
    const [vehicleHistory, setHistory] = useState<VehicleHistory[]>([])

    useEffect(() => {
      if (!selectedId) return
      history(selectedId, 'history')
        .then(setHistory)
        .catch((error) => toast.error(error.message))
    }, [selectedId])

    function handleManageButton(actionType: string){
      if(selectedId != null){
        if(actionType == "delete"){
            deleteVehicle(selectedId)
            .then((data) => toast.success(data.message))
            .then(() => handleClear())
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
            manage(selectedId, actionType)
            .then(() => toast.success(actionMessage))
            .then(() => findAll())
            .then(setVehicles)
            .then(() => history(selectedId, 'history'))
            .then(setHistory)
            .then(() => findById(selectedId))
            .then(handleSelect)
            .catch((error) => toast.error(error.message))
        }
      }
    }

    
  return (
      <SidebarInset>
        <SiteHeader
        title="Vehicle history"
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">

            <div className="px-4 lg:px-6">
              <SearchVehicleForm 
              vehicles={vehicles}
              onSelect={handleSelect}
              onClear={handleClear}
              key={clearCounter}
              />
            </div>

            <div className="px-4 lg:px-6">
              {selectedVehicle && <VehicleRegisterPreview formData={selectedVehicle} />}
            </div>
            <VehicleHistoryTable 
            history={vehicleHistory}
            />

          </div>
        </div>
      </SidebarInset>
  )
}