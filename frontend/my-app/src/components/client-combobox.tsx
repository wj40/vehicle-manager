"use client"

import { useMemo, useState } from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Plus } from "lucide-react"
import type { Client } from "@/types/client"

function clientLabel(c: Client): string {
  return `${c.name} ${c.surname}`
}

function parseNewClient(query: string): { name: string; surname: string; b_date: string } | null {
  const parts = query.trim().split(/\s+/)
  if (parts.length !== 3) return null
  const [name, surname, b_date] = parts
  if (!/^\d{4}-\d{2}-\d{2}$/.test(b_date)) return null
  const date = new Date(`${b_date}T00:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return { name, surname, b_date }
}

type Props = {
  clients: Client[]
  onSelect: (client: Client) => void
  onCreateNew: (data: { name: string; surname: string; b_date: string }) => void
}

export function ClientCombobox({ clients, onSelect, onCreateNew }: Props) {
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const query = q.toLowerCase()
    if (!query) return clients
    return clients.filter((c) => `${c.name} ${c.surname}`.toLowerCase().includes(query))
  }, [clients, q])

  const existingLabels = useMemo(() => new Set(clients.map(clientLabel)), [clients])

  const parsed = parseNewClient(q)
  const trimmedQuery = q.trim()
  const showAdd = !!parsed && !existingLabels.has(trimmedQuery)

  const displayItems = useMemo(() => {
    const items = filtered.map(clientLabel)
    if (showAdd) items.unshift(`+ Add: ${trimmedQuery}`)
    return items
  }, [filtered, showAdd, trimmedQuery])

  const lookup = useMemo(() => {
    const map = new Map<string, Client>()
    clients.forEach((c) => map.set(clientLabel(c), c))
    return map
  }, [clients])

  function handleSelect(value: string | null) {
    if (!value) return
    if (value.startsWith("+ Add: ")) {
      const data = parseNewClient(value.slice(7))
      if (data) onCreateNew(data)
      return
    }
    const client = lookup.get(value)
    if (client) onSelect(client)
  }

  return (
    <Combobox
      items={displayItems}
      filter={() => true}
      inputValue={q}
      onInputValueChange={(v) => setQ(v ?? "")}
      onValueChange={handleSelect}
    >
      <ComboboxInput
        placeholder="Select client or add new (name surname YYYY-MM-DD)..."
        aria-label="Client"
        className="h-11 text-[15px]"
      />
      <ComboboxContent>
        <ComboboxEmpty>No matching clients found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item.startsWith("+ Add: ") && <Plus className="size-3.5 text-muted-foreground" />}
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
