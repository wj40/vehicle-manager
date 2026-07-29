import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { changePassword, deleteUser, editUser, findUserById } from "@/lib/api"
import { FullScreenLoader } from "@/components/FullScreenLoader"
import { PencilIcon, Trash2Icon, LoaderIcon } from "lucide-react"

type User = {
  id: number
  login: string
  email: string
  role: "ROLE_ADMIN" | "ROLE_USER"
}

const roleVariant: Record<string, "default" | "destructive"> = {
  ROLE_ADMIN: "destructive",
  ROLE_USER: "default",
}

export default function UserDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const userId = Number(id)

  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editLogin, setEditLogin] = useState<string>("")
  const [editEmail, setEditEmail] = useState<string>("")
  const [editRole, setEditRole] = useState<string>("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userId) return
    findUserById(userId)
      .then((data) => {
        setUser(data)
        setEditLogin(data.login)
        setEditEmail(data.email)
        setEditRole(data.role)
      })
      .catch((e) => toast.error(e.message))
  }, [userId])

  function handleEdit() {
    setIsEditing(true)
  }

  function handleEditCancel() {
    setEditLogin(user!.login)
    setEditEmail(user!.email)
    setEditRole(user!.role)
    setIsEditing(false)
  }

  async function handleEditSave() {
    setSaving(true)
    try {
      await editUser(userId, { login: editLogin, email: editEmail, role: editRole})
      setUser((prev) => prev ? { ...prev, login: editLogin, email: editEmail, role: editRole as User["role"] } : prev)
      setIsEditing(false)
      toast.success("User updated")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    if (!newPassword) return
    setSaving(true)
    try {
      await changePassword(userId, newPassword)
      setNewPassword("")
      setChangingPassword(false)
      toast.success("Password changed")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      // TODO: add deleteUser(id) to api.ts
      await deleteUser(userId)
      setShowDeleteDialog(false)
      toast.success("User deleted")
      navigate("/users")
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  if (!user) return <FullScreenLoader />

  return (
    <SidebarInset>
      <SiteHeader title={`User: ${user.login}`} />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              &larr; Back
            </Button>
          </div>

          <div className="px-4 lg:px-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {!isEditing ? (
                <div className="rounded-xl border bg-card shadow-sm">
                  <div className="flex items-center justify-between border-b px-5 py-4">
                    <h2 className="text-sm font-semibold">User info</h2>
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <PencilIcon className="mr-1 size-3.5" />
                      Edit
                    </Button>
                  </div>
                  <div className="p-5 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">ID</span>
                      <span className="font-medium">#{user.id}</span>
                      <span className="text-muted-foreground">Login</span>
                      <span className="font-medium">{user.login}</span>
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium">{user.email}</span>
                      <span className="text-muted-foreground">Role</span>
                      <span>
                        <Badge variant={roleVariant[user.role] ?? "outline"}>
                          {user.role}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border bg-card shadow-sm">
                  <div className="border-b px-5 py-4">
                    <h2 className="text-sm font-semibold">Edit user</h2>
                  </div>
                  <div className="p-5 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-login">Login</Label>
                      <Input
                        id="edit-login"
                        value={editLogin}
                        onChange={(e) => setEditLogin(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input
                        id="edit-email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-role">Role</Label>
                      <Select value={editRole} onValueChange={(value) => { if (value) setEditRole(value) }}>
                        <SelectTrigger id="edit-role">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ROLE_USER">ROLE_USER</SelectItem>
                          <SelectItem value="ROLE_ADMIN">ROLE_ADMIN</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={handleEditCancel} disabled={saving}>
                        Cancel
                      </Button>
                      <Button onClick={handleEditSave} disabled={saving}>
                        {saving && <LoaderIcon className="mr-1 size-4 animate-spin" />}
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b px-5 py-4">
                  <h2 className="text-sm font-semibold">Change password</h2>
                </div>
                <div className="p-5 space-y-4">
                  {!changingPassword ? (
                    <Button variant="outline" onClick={() => setChangingPassword(true)}>
                      Change password
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="new-password">New password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => { setChangingPassword(false); setNewPassword("") }} disabled={saving}>
                          Cancel
                        </Button>
                        <Button onClick={handleChangePassword} disabled={saving || !newPassword}>
                          {saving && <LoaderIcon className="mr-1 size-4 animate-spin" />}
                          Save password
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-xl border bg-card shadow-sm">
                <div className="border-b px-5 py-4">
                  <h2 className="text-sm font-semibold">Danger zone</h2>
                </div>
                <div className="p-5">
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2Icon className="mr-1 size-4" />
                    Delete user
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{user.login}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={saving}>Cancel</Button>} />
            <Button variant="destructive" onClick={handleDelete} disabled={saving}>
              {saving && <LoaderIcon className="mr-1 size-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarInset>
  )
}
