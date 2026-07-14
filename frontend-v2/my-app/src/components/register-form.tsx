"use client"

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
            <FieldLabel htmlFor="brand">Brand</FieldLabel>
            <Input
              id="brand"
              placeholder="Opel, Fiat, Mercedes, Iveco..."
              value={formData.brand}
              onChange={(e) => onChange("brand", e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="model">Model</FieldLabel>
            <Input
              id="model"
              placeholder="Zafira, Panda, W211, Daily..."
              value={formData.model}
              onChange={(e) => onChange("model", e.target.value)}
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
        <Button type="submit" variant="default" size="lg" className="w-[150px]">
          <Save />
          Submit
        </Button>
      </div>
    </form>
  )
}