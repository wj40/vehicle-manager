import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Key, Undo2, Wrench, CheckCircle2, Trash2 } from "lucide-react"

const actions = [
  {
    label: "Rent vehicle",
    description: "Mark this vehicle as rented",
    actionType: "rent",
    icon: Key,
    variant: "default" as const,
  },
  {
    label: "Return vehicle",
    description: "Mark this vehicle as returned and available",
    actionType: "return",
    icon: Undo2,
    variant: "outline" as const,
  },
  {
    label: "Send to service",
    description: "Take this vehicle out of rotation for service",
    actionType: "service",
    icon: Wrench,
    variant: "outline" as const,
  },
  {
    label: "Finish service",
    description: "Mark service as complete, vehicle becomes available",
    actionType: "finish-service",
    icon: CheckCircle2,
    variant: "outline" as const,
  },
  {
    label: "Delete vehicle",
    description: "Permanently remove this vehicle from the fleet",
    actionType: "delete",
    icon: Trash2,
    variant: "destructive" as const,
  },
]

type VehicleActionCardsProps = {
  onAction?: (actionType: string) => void
}

export function VehicleActionCards({onAction}: VehicleActionCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Card key={action.label} className="@container/card">
            <CardHeader>
              <CardDescription className="flex items-center gap-2">
                <Icon className="size-4" />
                {action.label}
              </CardDescription>
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {action.description}
              </CardTitle>
            </CardHeader>
            <CardFooter>
              <Button variant={action.variant} className="w-full" onClick={() => onAction?.(action.actionType)}>
                {action.label}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}