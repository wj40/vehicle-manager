"use client"

import { useState, useMemo } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

type Props = {
  label: string
  items: {id: number, name: string}[]
  value: string
  onSelect: (name: string, id: number) => void
  placeholder?: string
  disabled?: boolean
}

export function RegisterComboBox({label, items, value, onSelect, placeholder, disabled}: Props) {
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const query = q.toLowerCase()
    if (!query) return items
    return items.filter(item => item.name.toLowerCase().includes(query))
  }, [items, q])

  const displayItems = filtered.map(item => item.name)

  const lookup = useMemo(() => {
    const map = new Map<string, number>()
    items.forEach(item => map.set(item.name, item.id))
    return map
  }, [items])

  return (
    <Combobox
      items={displayItems}
      filter={() => true}
      inputValue={q}
      onInputValueChange={(v) => setQ(v ?? "")}
      onValueChange={(selectedName) => {
        const id = lookup.get(selectedName as string)
        if (id !== undefined) onSelect(selectedName as string, id)
      }}
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder ?? `Select ${label.toLowerCase()}...`}
        aria-label={label}
        className="h-11 text-[15px]"
      />
      <ComboboxContent>
        <ComboboxEmpty>No {label.toLowerCase()} found.</ComboboxEmpty>
        <ComboboxList>
          {(name) => (
            <ComboboxItem key={name} value={name}>
              {name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
