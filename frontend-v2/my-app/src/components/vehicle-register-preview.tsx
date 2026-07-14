import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type VehicleFormData = {
  type: string
  brand: string
  model: string
  brandId: string
  modelId: string
  productionYear: string
  status: string
  regNumber: string
  vinNumber: string
}

type Props = {
  formData: VehicleFormData
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  available: "default",
  service: "destructive",
  rented: "secondary",
}

const statusDot: Record<string, string> = {
  available: "bg-emerald-500",
  service: "bg-red-500",
  rented: "bg-amber-500",
}

export function VehicleRegisterPreview({ formData }: Props) {
  const title = formData.brand || formData.model
    ? `${formData.brand || "..."} ${formData.model || ""}`.trim()
    : "-"

  return (
    <Card className="@container/card sticky top-4">
      <CardHeader>
        <CardDescription>Preview</CardDescription>
        <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
          {title}
        </CardTitle>
        <CardAction>
          <Badge
          variant={statusVariant[formData.status] ?? "outline"}
          className="capitalize"
          >
            <span
              className={`size-1.5 rounded-full ${statusDot[formData.status] ?? "bg-muted-foreground"}`}
            />
            {formData.status}
          </Badge>
        </CardAction>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4 px-6 pb-6 text-sm">
        <div>
          <p className="text-muted-foreground">Type</p>
          <p className="font-medium">{formData.type || "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Production year</p>
          <p className="font-medium">{formData.productionYear || "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Registration number</p>
          <p className="font-medium">{formData.regNumber || "-"}</p>
        </div>
        <div>
          <p className="text-muted-foreground">VIN</p>
          <p className="font-medium break-all">{formData.vinNumber || "-"}</p>
        </div>
      </div>
    </Card>
  )
}