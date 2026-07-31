export interface Client {
  id: number
  cid: string | null
  name: string
  surname: string
  b_date: string
  pesel: string | null
  balance: number
}

export interface RentQuote {
  days: number
  discount_pct: number
  price_per_day: number
  total: number
}
