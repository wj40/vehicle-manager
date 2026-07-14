import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function VehicleDetailCard() {
  return (
    <div className="px-4 lg:px-6">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Selected vehicle</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            Toyota Camry
          </CardTitle>
          <CardAction>
            <Badge variant="secondary">available</Badge>
          </CardAction>
        </CardHeader>
        <div className="grid grid-cols-2 gap-4 px-6 pb-6 text-sm @xl/card:grid-cols-4">
          <div>
            <p className="text-muted-foreground">Type</p>
            <p className="font-medium">Car</p>
          </div>
          <div>
            <p className="text-muted-foreground">Production year</p>
            <p className="font-medium">2009</p>
          </div>
          <div>
            <p className="text-muted-foreground">Registration number</p>
            <p className="font-medium">FAWHFN</p>
          </div>
          <div>
            <p className="text-muted-foreground">VIN</p>
            <p className="font-medium">WA1VGBFP6GA012345</p>
          </div>
        </div>
      </Card>
    </div>
  )
}