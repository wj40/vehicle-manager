import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loginField, setLoginField] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await login(loginField, password)
      navigate("/")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4 rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <Input placeholder="Login" value={loginField} onChange={e => setLoginField(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  )
}