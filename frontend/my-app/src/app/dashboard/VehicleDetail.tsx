import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { VehicleHistoryTable } from "@/components/vehicle-history-table"
import { VehicleActionCards } from "@/components/vehicle-action-cards"
import { toast } from "sonner"
import { type VehicleHistory } from "@/types/history"
import { findById, history, manage, deleteVehicle } from "@/lib/api"
import { type Vehicle } from "@/types/vehicle"
import { VehicleRegisterPreview, type VehicleFormData } from "@/components/vehicle-register-preview"
import { VehicleEditForm } from "@/components/vehicle-edit-form"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { getBrands } from "@/lib/api"

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const vehicleId = Number(id)

  const [selectedVehicle, setSelectedVehicle] = useState<VehicleFormData | null>(null)
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null)
  // const [brandMap, setBrandMap] = useState<Map<number, string>>(new Map())
  // const [modelMap, setModelMap] = useState<Map<number, string>>(new Map())
  const [isEditing, setIsEditing] = useState(false)
  const [editBrands, setEditBrands] = useState<{id: number, name: string}[]>([])
  const [vehicleHistory, setHistory] = useState<VehicleHistory[]>([])
  const [refreshKey, setRefreshKey] = useState(0)
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBrands().then((data: {id: number, name: string}[]) => {
      // setBrandMap(new Map(data.map(b => [b.id, b.name])))
      setEditBrands(data)
    })
  }, [])

  useEffect(() => {
    if (!vehicleId) return
    ;(async () => {
      const vehicle = await findById(vehicleId)

      
      // let brands = brandMap
      // if (brands.size === 0) {
      //   const data: {id: number, name: string}[] = await getBrands()
      //   brands = new Map(data.map(b => [b.id, b.name]))
      //   setBrandMap(brands)
      // }
      // const models: {id: number, name: string}[] = await getModels(vehicle.brand_id)
      // const mMap = new Map(models.map(m => [m.id, m.name]))
      // setModelMap(mMap)
      setVehicleData(vehicle)
      setSelectedVehicle({
        type: vehicle.type,
        brand: vehicle.brand_name ?? String(vehicle.brand_id),
        model: vehicle.model_name ?? String(vehicle.model_id),
        brandId: Number(vehicle.brand_id),
        modelId: Number(vehicle.model_id),
        regNumber: vehicle.reg_number,
        vinNumber: vehicle.vin_number,
        productionYear: vehicle.productionYear.toString(),
        status: vehicle.status,
      })
    })()
  }, [vehicleId, refreshKey])

  useEffect(() => {
    if (!vehicleId) return
    history(vehicleId, 'history')
      .then(setHistory)
      .catch((error) => toast.error(error.message))
  }, [vehicleId, refreshKey])

  function handleAction(actionType: string) {
    if (actionType === "delete") {
      deleteVehicle(vehicleId)
        // .then((data) => {
        //   toast.success("Vehicle deleted succesfully")
        //   navigate(-1)
        // })
        .catch((error) => toast.error(error.message))
    } else {
      manage(vehicleId, actionType)
        .then(() => {
          toast.success("Action completed")
          setRefreshKey(k => k + 1)
        })
        .catch((error) => toast.error(error.message))
    }
  }

  function handleEdit() {
    setIsEditing(true)
  }

  async function handleEditSave() {
    setIsEditing(false)
    setRefreshKey(k => k + 1)
    toast.success("Vehicle updated")
  }

  function handleEditCancel() {
    setIsEditing(false)
  }
  if(!vehicleData) return <FullScreenLoader />
  return (
    <SidebarInset>
      <SiteHeader title="Vehicle details" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              &larr; Back
            </Button>
          </div>

          <div className="px-4 lg:px-6 space-y-6">
            {selectedVehicle && !isEditing && (
              <div className="relative">
                <VehicleRegisterPreview formData={selectedVehicle} />
                <div className="mt-2 flex justify-end">
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    Edit vehicle
                  </Button>
                </div>
              </div>
            )}
            {selectedVehicle && isEditing && vehicleData && (
              <VehicleEditForm
                vehicle={vehicleData}
                brands={editBrands}
                // brandMap={brandMap}
                // modelMap={modelMap}
                onSave={handleEditSave}
                onCancel={handleEditCancel}
              />
            )}

            <VehicleActionCards onAction={handleAction} />

            <VehicleHistoryTable history={vehicleHistory} />
          </div>
        </div>
      </div>
    </SidebarInset>
  )
}
