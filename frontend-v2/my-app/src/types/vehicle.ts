export interface Vehicle {
    id: number
    type: "car" | "truck" | "motorcycle" | "bus"
    brand: string
    model: string
    reg_number: string
    vin_number: string
    productionYear: number
    status: "available" | "rented" | "service"
    created_at?: string
}