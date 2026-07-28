import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function RegisterUser() {
  const navigate = useNavigate()
  const [loginField, setLoginField] = useState("")
  const [emailField, setEmailField] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ login: loginField, email: emailField, password })
        })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Registration failed")
      navigate("/login")
      toast.success("Account created successfully")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4 rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Create new user</h1>
        <Input placeholder="Login" value={loginField} onChange={e => setLoginField(e.target.value)} />
        <Input placeholder="Email" value={emailField} onChange={e => setEmailField(e.target.value)} />
        <Input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit">Register</Button>
      </form>
    </div>
  )
}