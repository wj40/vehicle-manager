const API_URL = "http://localhost/vehicle-manager/backend/Public/index.php?route=api/vehicle";


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