"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Save, X } from "lucide-react"
import { RegisterComboBox } from "./register-combo-box"
import { getModels } from "@/lib/api"
import type { Vehicle } from "@/types/vehicle"

const types = [
  { label: "Car", value: "car" },
  { label: "Truck", value: "truck" },
  { label: "Motorcycle", value: "motorcycle" },
  { label: "Bus", value: "bus" },
]

type Props = {
  vehicle: Vehicle
  brands: {id: number, name: string}[]
  brandMap: Map<number, string>
  modelMap: Map<number, string>
  onSave: () => void
  onCancel: () => void
}

export function VehicleEditForm({vehicle, brands, brandMap, modelMap, onSave, onCancel}: Props) {
  const [type, setType] = useState(vehicle.type)
  const [brandName, setBrandName] = useState(brandMap.get(vehicle.brand_id) ?? "")
  const [brandId, setBrandId] = useState(vehicle.brand_id)
  const [modelName, setModelName] = useState(modelMap.get(vehicle.model_id) ?? "")
  const [modelId, setModelId] = useState(vehicle.model_id)
  const [models, setModels] = useState<{id: number, name: string}[]>([])
  const [productionYear, setProductionYear] = useState(String(vehicle.productionYear))
  const [regNumber, setRegNumber] = useState(vehicle.reg_number)
  const [vinNumber, setVinNumber] = useState(vehicle.vin_number)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!brandId) return
    getModels(brandId).then(setModels)
  }, [brandId])

  useEffect(() => {
    if (brandId !== vehicle.brand_id) {
      setModelName("")
      setModelId(0)
    }
  }, [brandId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const { updateVehicle } = await import("@/lib/api")
      await updateVehicle(vehicle.id, {
        type,
        brand_id: brandId,
        model_id: modelId,
        reg_number: regNumber,
        vin_number: vinNumber,
        productionYear,
      })
      onSave()
    } catch (err) {
      const { toast } = await import("sonner")
      toast.error(err instanceof Error ? err.message : "Error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Edit vehicle #{vehicle.id}</h3>
      </div>
      <FieldSet>
        <FieldGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field>
            <FieldLabel>Type</FieldLabel>
            <Select items={types} value={type} onValueChange={(v) => setType(v as typeof type)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {types.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Brand</FieldLabel>
            <RegisterComboBox
              items={brands}
              value={brandName}
              onSelect={(name, id) => { setBrandName(name); setBrandId(id) }}
              label="Brand"
            />
          </Field>
          <Field>
            <FieldLabel>Model</FieldLabel>
            <RegisterComboBox
              items={models}
              value={modelName}
              onSelect={(name, id) => { setModelName(name); setModelId(id) }}
              label="Model"
              disabled={!brandId}
            />
          </Field>
          <Field>
            <FieldLabel>Production year</FieldLabel>
            <Input
              type="number"
              placeholder="2026"
              value={productionYear}
              onChange={(e) => setProductionYear(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>Registration number</FieldLabel>
            <Input
              placeholder="GWE 293AW"
              value={regNumber}
              minLength={4}
              maxLength={14}
              onChange={(e) => setRegNumber(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel>VIN number</FieldLabel>
            <Input
              placeholder="WA1VGBFP6GA012345"
              value={vinNumber}
              minLength={17}
              maxLength={17}
              onChange={(e) => setVinNumber(e.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={saving}>
          <X />
          Cancel
        </Button>
        <Button type="submit" variant="default" size="lg" disabled={saving}>
          <Save />
          {saving ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
