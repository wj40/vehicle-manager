import { useState } from "react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/site-header"
import { RegisterForm } from "@/components/register-form"
import { VehicleRegisterPreview, type VehicleFormData } from "@/components/vehicle-register-preview"
import {
  SidebarInset,
} from "@/components/ui/sidebar"
import { register } from "@/lib/api"

const initialFormData: VehicleFormData = {
  type: "",
  brand: "",
  model: "",
  regNumber: "",
  vinNumber: "",
  productionYear: "",
  status: "",
}

export default function Register() {
  const [formData, setFormData] = useState<VehicleFormData>(initialFormData)

  const handleChange = (field: keyof VehicleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    register({
      type: formData.type,
      brand: formData.brand,
      model: formData.model,
      reg_number: formData.regNumber,
      vin_number: formData.vinNumber,
      productionYear: formData.productionYear,
      status: formData.status,
    })
      .then((data) => {
        toast.success(data.message ?? "Vehicle registered")
        setFormData(initialFormData)
      })
      .catch((error) => toast.error(error.message))

  }

  return (
    
      <SidebarInset>
        <SiteHeader
        title="Register vehicles"
        />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">

            <div className="px-4 lg:px-6">
              <VehicleRegisterPreview formData={formData} />
            </div>

            <div className="px-4 lg:px-6">
              <RegisterForm formData={formData} onChange={handleChange} onSubmit={handleSubmit} />
            </div>

          </div>
        </div>
      </SidebarInset>
  )
}