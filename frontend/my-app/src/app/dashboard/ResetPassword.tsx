import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ResetPassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const { email } = useParams()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await fetch("/api/reset", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? "Error")
      navigate("/login")
      toast.success("Password changed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex w-80 flex-col gap-4 rounded-xl border bg-card p-6">
        <h1 className="text-xl font-semibold">Recover Password</h1>
        <Input placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} />
        <Button type="submit">Reset</Button>
      </form>
    </div>
  )
}