export interface VehicleHistory {
    id: number
    vehicle_id: number
    action: "rent" | "return" | "service" | "finishService" | "delete"
    old_status: string
    new_status: string
    changed_at: string
}