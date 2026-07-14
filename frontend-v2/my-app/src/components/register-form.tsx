"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
  FieldDescription,
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
import { Save } from "lucide-react"
import type { VehicleFormData } from "./vehicle-register-preview"
import { RegisterComboBox } from "./register-combo-box"
import { getBrands, getModels } from "@/lib/api"

const types = [
  { label: "Car", value: "car" },
  { label: "Truck", value: "truck" },
  { label: "Motorcycle", value: "motorcycle" },
  { label: "Bus", value: "bus" },
]
const statuses = [
  { label: "Available", value: "available" },
  { label: "Rented", value: "rented" },
  { label: "Service", value: "service" },
]

type Props = {
  formData: VehicleFormData
  onChange: (field: keyof VehicleFormData, value: string) => void
  onSubmit: (e: React.FormEvent) => void
}

export function RegisterForm({ formData, onChange, onSubmit }: Props) {
  const [brands, setBrands] = useState<{id: number, name: string}[]>([])
  const [models, setModels] = useState<{id: number, name: string}[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)

  useEffect(() => {
    getBrands().then(setBrands)
  }, [])

  useEffect(() => {
    if (!selectedBrandId) { setModels([]); return }
    getModels(selectedBrandId).then(setModels)
  }, [selectedBrandId])

  return (
    <form className="flex flex-col gap-4 @5xl/main:grid @5xl/main:grid-cols-3" onSubmit={onSubmit}>

      <FieldSet className="rounded-xl border bg-card p-5">
        <FieldLegend>Vehicle identification</FieldLegend>
        <FieldDescription>What kind of vehicle is this, and its build details.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="type">Vehicle type</FieldLabel>
            <Select items={types} value={formData.type} onValueChange={(v) => onChange("type", v ?? "")}>
              <SelectTrigger id="type">
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
              value={formData.brand}
              onSelect={(name, id) => {
                onChange("brand", name)
                onChange("brandId", String(id))
                setSelectedBrandId(id)
                onChange("model", "")
                onChange("modelId", "0")
              }}
              label="Brand"
            />
          </Field>
          <Field>
            <FieldLabel>Model</FieldLabel>
            <RegisterComboBox
              items={models}
              value={formData.model}
              onSelect={(name, id) => {
                onChange("model", name)
                onChange("modelId", String(id))
              }}
              label="Model"
              disabled={!selectedBrandId}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="productionYear">Production year</FieldLabel>
            <Input
              id="productionYear"
              type="number"
              placeholder="2026"
              value={formData.productionYear}
              onChange={(e) => onChange("productionYear", e.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="rounded-xl border bg-card p-5">
        <FieldLegend>Status</FieldLegend>
        <FieldDescription>Current availability of the vehicle.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="status">Vehicle status</FieldLabel>
            <Select items={statuses} value={formData.status} onValueChange={(v) => onChange("status", v ?? "")}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {statuses.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </FieldGroup>
      </FieldSet>

      <FieldSet className="rounded-xl border bg-card p-5">
        <FieldLegend>Documents</FieldLegend>
        <FieldDescription>Official identifiers for this vehicle.</FieldDescription>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="regNumber">Registration number</FieldLabel>
            <Input
              id="regNumber"
              placeholder="GWE 293AW"
              value={formData.regNumber}
              minLength={4}
              maxLength={14}
              onChange={(e) => onChange("regNumber", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="vinNumber">VIN number</FieldLabel>
            <Input
              id="vinNumber"
              placeholder="WA1VGBFP6GA012345"
              value={formData.vinNumber}
              minLength={17}
              maxLength={17}
              onChange={(e) => onChange("vinNumber", e.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>

      <div className="flex justify-end @5xl/main:col-span-3">
        <Button type="submit" variant="default" size="lg" className="w-37.5">
          <Save />
          Submit
        </Button>
      </div>
    </form>
  )
}
