function getToken(): string | null {
  return localStorage.getItem("token")
}

async function apiFetch(url: string, options: RequestInit = {}): Promise<any> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> ?? {}),
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(url, { ...options, headers })
  if (response.status === 401) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/login"
    throw new Error("Session expired")
  }
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? "Error")
  return data
}

const API_URL = "http://localhost/vehicle-manager/backend/Public/index.php?route=api/vehicle";
const API_URL_BM = "http://localhost/vehicle-manager/backend/Public/index.php?route=api";

export async function findAll(){
  return apiFetch(API_URL)
}

export async function findById(id: number){
    return apiFetch(`${API_URL}/${id}`)
}

export async function register(formData: object){
    return apiFetch(API_URL, {method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(formData)})
}

export async function manage(id: number, action: string){
    return apiFetch(`${API_URL}/${id}/${action}`, {method: 'POST'})
}

export async function updateVehicle(id: number, data: object){
    return apiFetch(`${API_URL}/${id}/edit`, {method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(data)})
}

export async function deleteVehicle(id: number){
    return apiFetch(`${API_URL}/${id}`, {method: 'DELETE'})
}

export async function history(id: number, action: string){
    return apiFetch(`${API_URL}/${id}/${action}`)
}

export async function getBrands(){
    return apiFetch(`${API_URL_BM}/brands`)
}

export async function getModels(brandId: number){
    return apiFetch(`${API_URL_BM}/models/${brandId}`)
}

export async function addBrand(name: string){
    return apiFetch(`${API_URL_BM}/brands`, {method: 'POST', headers: { "Content-Type": "application/json"}, body: JSON.stringify({name: name})})
}

export async function updateBrand(id: number, name: string){
    return apiFetch(`${API_URL_BM}/brands/${id}`, {method: 'POST', headers: { "Content-Type": "application/json"}, body: JSON.stringify({name: name})})
}

export async function deleteBrand(id: number){
    return apiFetch(`${API_URL_BM}/brands/${id}`, {method: 'DELETE'})
}

export async function addModel(brandId: number, name: string){
    return apiFetch(`${API_URL_BM}/models`, {method: 'POST', headers: { "Content-Type": "application/json"}, body: JSON.stringify({brand_id: brandId, name: name})})
}

export async function updateModel(id: number, name: string){
    return apiFetch(`${API_URL_BM}/models/${id}`, {method: 'POST', headers: { "Content-Type": "application/json"}, body: JSON.stringify({name: name})})
}

export async function deleteModel(id: number){
    return apiFetch(`${API_URL_BM}/models/${id}`, {method: 'DELETE'})
}
