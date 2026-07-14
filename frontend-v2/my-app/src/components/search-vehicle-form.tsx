"use client"

import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { SearchIcon, X } from "lucide-react"
import { ComboboxSearch } from "./combo-box-search"
import { Button } from "./ui/button"
import { type Vehicle } from "@/types/vehicle"

type Props = {
  vehicles: Vehicle[]
  onSelect: (vehicle: Vehicle) => void
  onClear: () => void
}

function SearchVehicleForm({vehicles, onSelect, onClear}: Props) {


  return (
    <div className="mx-5 rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <SearchIcon className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold leading-none">Search vehicles</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Find a vehicle by brand, model, registration number or VIN
          </p>
        </div>
      </div>

      <div className="p-5">
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="vehicle-search" className="sr-only">
                Search for vehicles
              </FieldLabel>
              <ComboboxSearch 
              vehicles={vehicles}
              onSelect={onSelect}
              />
            </Field>
          </FieldGroup>

          <div className="mt-4 flex flex-col-reverse justify-end gap-2 sm:flex-row">
            <Button variant="outline" size="lg" onClick={onClear} aria-label="Clear filters">
              <X />
              Clear
            </Button>
          </div>
        </FieldSet>
      </div>
    </div>
  )
}

export default SearchVehicleForm
