const API_URL = "http://localhost/vehicle-manager/backend/Public/index.php?route=api/vehicle";
const API_URL_BM = "http://localhost/vehicle-manager/backend/Public/index.php?route=api";

export async function findAll(){
  const response = await fetch(API_URL)
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? "Blad")
  return data
}

export async function findById(id: number){
    const API = `${API_URL}/${id}`
    const response = await fetch (API)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

export async function register(formData: object){
    const response = await fetch(API_URL, {method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)})
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

export async function manage(id: number, action: string){
    const response = await fetch(`${API_URL}/${id}/${action}`, {method: 'POST'})
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

export async function updateVehicle(id: number, data: object){
    const response = await fetch(`${API_URL}/${id}/edit`, {method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)})
    const result = await response.json()
    if (!response.ok) throw new Error(result.error ?? "Blad")
    return result
}

export async function deleteVehicle(id: number){
    const response = await fetch(`${API_URL}/${id}`, {method: 'DELETE'})
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

export async function history(id: number, action: string){
    const response = await fetch(`${API_URL}/${id}/${action}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

export async function getBrands(){
    const response = await fetch(`${API_URL_BM}/brands`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

export async function getModels(brandId: number){
    const API = `${API_URL_BM}/models/${brandId}`
    const response = await fetch (API)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error ?? "Blad")
    return data
}

// POST /api/brands
export async function addBrand(name: string){
    
}

// POST /api/brands/{id}
export async function updateBrand(id: number, name: string){

}

// DELETE /api/brands/{id}
export async function deleteBrand(id: number){

} 

// POST /api/models
export async function addModel(brandId: number, name: string){

}

// POST /api/models/{id}
export async function updateModel(id: number, name: string){

}

// DELETE /api/models/{id}
export async function deleteModel(id: number){

}