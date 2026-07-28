import { useEffect, useState } from "react"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { getBrands, getModels, addBrand, updateBrand, deleteBrand, addModel, updateModel, deleteModel } from "@/lib/api"
import { PlusIcon, PencilIcon, Trash2Icon, LoaderIcon } from "lucide-react"

type Brand = { id: number; name: string }
type Model = { id: number; name: string }

type DialogMode = 
  | 'addBrand' | 'editBrand' | 'deleteBrand'
  | 'addModel' | 'editModel' | 'deleteModel'

export default function Brands() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null)
  const [loadingBrands, setLoadingBrands] = useState(true)
  const [loadingModels, setLoadingModels] = useState(false)

  const [dialogMode, setDialogMode] = useState<DialogMode | null>(null)
  const [dialogItem, setDialogItem] = useState<Brand | Model | null>(null)
  const [inputValue, setInputValue] = useState("")

  function loadBrands() {
    setLoadingBrands(true)
    getBrands()
      .then(setBrands)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoadingBrands(false))
  }

  function loadModels(brandId: number) {
    setLoadingModels(true)
    getModels(brandId)
      .then(setModels)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoadingModels(false))
  }

  useEffect(() => {
    loadBrands()
  }, [])

  useEffect(() => {
    if (selectedBrandId !== null) {
      loadModels(selectedBrandId)
    } else {
      setModels([])
    }
  }, [selectedBrandId])

  function openDialog(mode: DialogMode, item?: Brand | Model) {
    setDialogMode(mode)
    setDialogItem(item ?? null)
    setInputValue(item ? item.name : "")
  }

  function closeDialog() {
    setDialogMode(null)
    setDialogItem(null)
    setInputValue("")
  }

  function handleSave() {
    if (!dialogMode || !inputValue.trim()) return

    const name = inputValue.trim()

    switch (dialogMode) {
      case 'addBrand':
        addBrand(name)
          .then(() => {
            loadBrands()
            closeDialog()
            toast.success("Brand added")
          })
          .catch((e) => toast.error(e.message))
        break

      case 'editBrand':
        if (dialogItem && 'name' in dialogItem) {
          updateBrand(dialogItem.id, name)
            .then(() => {
              loadBrands()
              closeDialog()
              toast.success("Brand updated")
            })
            .catch((e) => toast.error(e.message))
        }
        break

      case 'addModel':
        if (selectedBrandId !== null) {
          addModel(selectedBrandId, name)
            .then(() => {
              loadModels(selectedBrandId)
              closeDialog()
              toast.success("Model added")
            })
            .catch((e) => toast.error(e.message))
        }
        break

      case 'editModel':
        if (dialogItem && 'name' in dialogItem) {
          updateModel(dialogItem.id, name)
            .then(() => {
              if (selectedBrandId !== null) loadModels(selectedBrandId)
              closeDialog()
              toast.success("Model updated")
            })
            .catch((e) => toast.error(e.message))
        }
        break
    }
  }

  function handleDelete() {
    if (!dialogMode || !dialogItem) return

    switch (dialogMode) {
      case 'deleteBrand':
        deleteBrand(dialogItem.id)
          .then(() => {
            if (selectedBrandId === dialogItem.id) setSelectedBrandId(null)
            loadBrands()
            closeDialog()
            toast.success("Brand deleted")
          })
          .catch((e) => toast.error(e.message))
        break

      case 'deleteModel':
        deleteModel(dialogItem.id)
          .then(() => {
            if (selectedBrandId !== null) loadModels(selectedBrandId)
            closeDialog()
            toast.success("Model deleted")
          })
          .catch((e) => toast.error(e.message))
        break
    }
  }

  const selectedBrand = brands.find((b) => b.id === selectedBrandId)

  const dialogTitle = () => {
    if (!dialogMode) return ""
    switch (dialogMode) {
      case 'addBrand': return "Add brand"
      case 'editBrand': return "Edit brand"
      case 'deleteBrand': return "Delete brand"
      case 'addModel': return "Add model"
      case 'editModel': return "Edit model"
      case 'deleteModel': return "Delete model"
    }
  }

  return (
    <SidebarInset className="max-h-[calc(100dvh-var(--header-height))] overflow-hidden">
      <SiteHeader title="Brands & models" />
      <div className="flex flex-1 flex-col min-h-0 overflow-y-auto">
        <div className="@container/main flex flex-1 flex-col min-h-0 gap-4 py-4 md:gap-6 md:py-6 overflow-y-auto">
          <div className="flex flex-1 flex-col gap-4 px-4 lg:flex-row min-h-0">
            {/* Left panel - Brands */}
            <div className="flex flex-1 lg:flex-none w-full lg:w-1/3 min-w-0 min-h-0 flex-col rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">Brands</h2>
                <Button size="sm" onClick={() => openDialog('addBrand')}>
                  <PlusIcon className="mr-1 size-4" />
                  Add
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {loadingBrands ? (
                  <div className="flex justify-center py-8">
                    <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : brands.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No brands</p>
                ) : (
                  <div className="space-y-1">
                    {brands.map((brand) => (
                      <div
                        key={brand.id}
                        data-selected={selectedBrandId === brand.id ? true : undefined}
                        className="flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent data-[selected]:bg-accent data-[selected]:font-medium"
                        onClick={() => setSelectedBrandId(brand.id)}
                      >
                        <span className="truncate">{brand.name}</span>
                        <div className="flex shrink-0 gap-1" onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon-xs" onClick={() => openDialog('editBrand', brand)}>
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-xs" onClick={() => openDialog('deleteBrand', brand)}>
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right panel - Models */}
            <div className="flex flex-1 min-h-0 flex-col rounded-lg border bg-card">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <h2 className="text-sm font-semibold">
                  {selectedBrand ? `Models — ${selectedBrand.name}` : "Models"}
                </h2>
                <Button size="sm" disabled={selectedBrandId === null} onClick={() => openDialog('addModel')}>
                  <PlusIcon className="mr-1 size-4" />
                  Add
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {selectedBrandId === null ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">Select a brand</p>
                ) : loadingModels ? (
                  <div className="flex justify-center py-8">
                    <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
                  </div>
                ) : models.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">No models for this brand</p>
                ) : (
                  <div className="space-y-1">
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent"
                      >
                        <span className="truncate">{model.name}</span>
                        <div className="flex shrink-0 gap-1">
                          <Button variant="ghost" size="icon-xs" onClick={() => openDialog('editModel', model)}>
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon-xs" onClick={() => openDialog('deleteModel', model)}>
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Dialog */}
      {(dialogMode === 'addBrand' || dialogMode === 'editBrand' || dialogMode === 'addModel' || dialogMode === 'editModel') && (
        <Dialog open onOpenChange={(open) => { if (!open) closeDialog() }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle()}</DialogTitle>
            </DialogHeader>
            <div className="py-2">
              <Input
                placeholder="Name"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                autoFocus
              />
            </div>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      {(dialogMode === 'deleteBrand' || dialogMode === 'deleteModel') && (
        <Dialog open onOpenChange={(open) => { if (!open) closeDialog() }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{dialogTitle()}</DialogTitle>
            </DialogHeader>
            <p className="py-2 text-sm text-muted-foreground">
              Are you sure you want to delete "<strong>{dialogItem?.name}</strong>"?
            </p>
            <DialogFooter>
              <DialogClose render={<Button variant="outline">Cancel</Button>} />
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </SidebarInset>
  )
}
