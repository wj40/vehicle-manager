import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = { id: number; login: string; email: string; role: string; }
type AuthContextType = {
  user: User | null
  token: string | null
  loading: boolean
  login: (login: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  async function login(login: string, password: string) {
    const res = await fetch(
      "/api/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, password }),
      }
    )
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? "Login failed")

    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify({ id: data.id, login: data.login, email: data.email, role: data.role }))
    setToken(data.token)
    setUser({ id: data.id, login: data.login, email: data.email, role: data.role?.[0] ?? data.role })
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}