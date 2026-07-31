"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import { ClientCombobox } from "@/components/client-combobox"
import { getClients, addClient, getRentQuote, rentVehicle } from "@/lib/api"
import { formatPrice } from "@/lib/utils"
import type { Client, RentQuote } from "@/types/client"
import type { Vehicle } from "@/types/vehicle"

function todayISO(): string {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + days)
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 10)
}

type Props = {
  vehicle: Vehicle
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function RentDialog({ vehicle, open, onOpenChange, onSuccess }: Props) {
  const [clients, setClients] = useState<Client[]>([])
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [pesel, setPesel] = useState("")
  const [startDate, setStartDate] = useState(todayISO())
  const [endDate, setEndDate] = useState(addDays(todayISO(), 7))
  const [quote, setQuote] = useState<RentQuote | null>(null)
  const [loadingClients, setLoadingClients] = useState(false)
  const [creatingClient, setCreatingClient] = useState(false)
  const [quoteLoading, setQuoteLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!open) return
    setSelectedClient(null)
    setPesel("")
    setStartDate(todayISO())
    setEndDate(addDays(todayISO(), 7))
    setQuote(null)
    setLoadingClients(true)
    getClients()
      .then(setClients)
      .catch((error) => toast.error(error.message))
      .finally(() => setLoadingClients(false))
  }, [open])

  const needPesel = selectedClient !== null && !selectedClient.pesel

  const datesValid = Boolean(startDate && endDate) && new Date(`${endDate}T00:00:00`) > new Date(`${startDate}T00:00:00`)

  const fetchQuote = useCallback(async () => {
    if (!datesValid) {
      setQuote(null)
      return
    }
    setQuoteLoading(true)
    try {
      const result = await getRentQuote(vehicle.id, { start_date: startDate, end_date: endDate })
      setQuote(result)
    } catch (error) {
      toast.error((error as { message?: string }).message ?? "Error")
      setQuote(null)
    } finally {
      setQuoteLoading(false)
    }
  }, [datesValid, startDate, endDate, vehicle.id])

  useEffect(() => {
    fetchQuote()
  }, [fetchQuote])

  function handleCreateNew(data: { name: string; surname: string; b_date: string }) {
    setCreatingClient(true)
    addClient(data)
      .then((res) => {
        const client: Client = res.client
        setClients((prev) => [...prev, client])
        setSelectedClient(client)
        setPesel("")
        toast.success(res.message ?? "Client created")
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setCreatingClient(false))
  }

  function handleSubmit() {
    if (submitting) return
    if (!selectedClient) return
    if (needPesel && pesel.trim().length !== 11) return

    setSubmitting(true)
    rentVehicle(vehicle.id, {
      client_id: selectedClient.id,
      start_date: startDate,
      end_date: endDate,
      ...(needPesel ? { pesel: pesel.trim() } : {}),
    })
      .then(() => {
        toast.success("Vehicle rented")
        onSuccess()
        onOpenChange(false)
      })
      .catch((error) => toast.error(error.message))
      .finally(() => setSubmitting(false))
  }

  const canSubmit =
    selectedClient !== null &&
    (!needPesel || pesel.trim().length === 11) &&
    datesValid &&
    !submitting &&
    !creatingClient

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rent vehicle #{vehicle.id}</DialogTitle>
          <DialogDescription>
            {vehicle.brand_name} {vehicle.model_name} &middot; {formatPrice(vehicle.price)} / day
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Client</p>
            {selectedClient ? (
              <div className="flex items-center justify-between gap-2 rounded-lg border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selectedClient.name} {selectedClient.surname}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {selectedClient.cid ?? "-"} &middot; {selectedClient.b_date}
                    {selectedClient.pesel ? " &middot; PESEL set" : " &middot; no PESEL"}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedClient(null)}>
                  Change
                </Button>
              </div>
            ) : (
              <ClientCombobox
                clients={clients}
                onSelect={setSelectedClient}
                onCreateNew={handleCreateNew}
              />
            )}
            {loadingClients && <p className="mt-1 text-xs text-muted-foreground">Loading clients...</p>}
          </div>

          {needPesel && (
            <Field>
              <FieldLabel htmlFor="pesel">PESEL</FieldLabel>
              <Input
                id="pesel"
                type="text"
                placeholder="Enter 11-digit PESEL"
                value={pesel}
                maxLength={11}
                inputMode="numeric"
                onChange={(e) => setPesel(e.target.value.replace(/\D/g, ""))}
              />
            </Field>
          )}

          <div>
            <p className="mb-1.5 text-xs text-muted-foreground">Rental period</p>
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="startDate">Start date</FieldLabel>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="endDate">End date</FieldLabel>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            {quoteLoading ? (
              <p className="text-muted-foreground">Calculating price...</p>
            ) : quote ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Days</span>
                  <span className="font-medium">{quote.days}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per day</span>
                  <span className="font-medium">{formatPrice(quote.price_per_day)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="font-medium">{quote.discount_pct > 0 ? `-${quote.discount_pct}%` : "0%"}</span>
                </div>
                <div className="mt-1 flex justify-between border-t pt-1.5">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold">{formatPrice(quote.total)}</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {datesValid ? "Price will appear here." : "End date must be after start date."}
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            {submitting ? "Renting..." : "Rent"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
