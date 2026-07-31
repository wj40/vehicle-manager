export interface Vehicle {
    id: number
    type: "car" | "truck" | "motorcycle" | "bus"
    brand_id: number
    model_id: number
    reg_number: string
    vin_number: string
    productionYear: number
    price: number
    status: "available" | "rented" | "service"
    created_at?: string
    brand_name: string
    model_name: string
}