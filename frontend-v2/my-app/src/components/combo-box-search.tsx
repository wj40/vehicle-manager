"use client"

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import type { Vehicle } from "@/types/vehicle"
import { useState, useMemo } from "react"


type Props = {
  vehicles: Vehicle[]
  onSelect: (vehicle: Vehicle) => void
}

export function ComboboxSearch({vehicles, onSelect}: Props) {
  const [q, setQ] = useState("")


  const query = q.toLowerCase()

  function score(v: Vehicle): number {
    const fields = [
      { val: v.reg_number, w: 5 },
      { val: v.vin_number, w: 4 },
      { val: v.brand, w: 2 },
      { val: v.model, w: 1 },
    ]
    let s = 0
    for (const { val, w } of fields) {
      const lv = val?.toLowerCase() ?? ""
      if (lv === query) s += 100 * w
      else if (lv.startsWith(query)) s += 50 * w
      else if (lv.includes(query)) s += 10 * w
    }
    return s
  }

  const scored = vehicles
    .map(v => ({ v, s: score(v) }))
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s)
  const filtered = scored.map(x => x.v)
  const showResults = filtered.length > 0 && filtered.length <= 10

  const displayItems = showResults
  ? filtered.map(v => `${v.brand} ${v.model} (${v.reg_number})`)
  : []

  const lookup = useMemo(() => {
  const map = new Map<string, Vehicle>()
  vehicles.forEach(v => map.set(`${v.brand} ${v.model} (${v.reg_number})`, v))
  return map
  }, [vehicles])

  return (
    <div className="w-full">
      <Combobox items={displayItems}
        filter={() => true}
        inputValue={q}
        onInputValueChange={(value) => setQ((value ?? ""))}
        onValueChange={(value) => {
          const v = lookup.get(value as string);
          if (v) onSelect(v)
        }}
      >
        <ComboboxInput
          className="h-11 text-[15px]"
          placeholder="Search by brand, model, registration number or VIN..."
        />
        <ComboboxContent>
          <ComboboxEmpty>No matching vehicles found.</ComboboxEmpty>
          <ComboboxList>
            {(item) => (
              <ComboboxItem key={item} value={item}>
                {item}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
