"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus, Edit2, AlertTriangle, X } from "lucide-react"
import { useInventory, Status } from "@/hooks/admin/useInventory"
import { InventoryItem } from "@/lib/store"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { SelectTrigger } from "@radix-ui/react-select"
import AdminSkeleton from "@/components/admin-skeleton"

const statusColors: Record<Status, string> = {
  good: "bg-green-100 text-green-800 border-green-300",
  low: "bg-yellow-100 text-yellow-800 border-yellow-300",
  critical: "bg-red-100 text-red-800 border-red-300",
}

export default function InventoryPage() {
  const { inventory = [], addItem, updateItem, loading } = useInventory()
  const { toast } = useToast()
  // const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Modal states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null)
  const [name, setName] = useState("")
  const [unit, setUnit] = useState("")
  const [currentStock, setCurrentStock] = useState<number>(0)
  const [reorderLevel, setReorderLevel] = useState<number | undefined>(undefined)

  // Status helpers
  const lowStockItems = inventory.filter((item) => item.current_stock <= (item.reorder_level ?? 0) * 2)
  const criticalItems = inventory.filter((item) => item.status === "critical")
  // const totalValue = inventory.reduce((sum, item) => sum + item.current_stock * 15, 0)

  // Open Add / Edit modal
  const openAddModal = () => {
    setEditingItem(null)
    setName("")
    setUnit("")
    setCurrentStock(0)
    setReorderLevel(undefined)
    setIsDialogOpen(true)
  }

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item)
    setName(item.name)
    setUnit(item.unit)
    setCurrentStock(item.current_stock)
    setReorderLevel(item.reorder_level ?? undefined)
    setIsDialogOpen(true)
  }

  const handleSaveItem = async () => {
    try {
      if (!name || !unit) return
      setIsDialogOpen(false)

      if (editingItem) {
        await updateItem(editingItem.id, { name, unit, current_stock: currentStock, reorder_level: reorderLevel ?? null })
      } else {
        await addItem({
          name,
          unit,
          current_stock: currentStock,
          reorder_level: reorderLevel ?? null,
        })
      }


    } catch (err: any) {
      toast({ title: "Failed to save item", description: err.message || "Unknown error", variant: "destructive" })
    }
  }

  if (loading) return <AdminSkeleton />

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h2>
          <p className="text-muted-foreground">Monitor stock levels, track items, and manage reorders</p>
        </div>
        <Button className="gap-2" onClick={openAddModal}>
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="mb-8 bg-orange-50 border-orange-200">
          <CardContent className="p-6 flex gap-4">
            <AlertCircle className="w-6 h-6 text-orange-600 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-orange-900 mb-1">Low Stock Alert</h3>
              <p className="text-orange-800 text-sm">
                {lowStockItems.length} item(s) are below reorder level. Consider placing a reorder.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {criticalItems.length > 0 && (
        <Card className="mb-8 bg-red-50 border-red-200">
          <CardContent className="p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Critical Stock Alert!</h3>
              <p className="text-red-800 text-sm mb-2">
                {criticalItems.length} item(s) are out of stock or critically low.
              </p>
              <div className="text-sm text-red-700 space-y-1">
                {criticalItems.map((item) => (
                  <div key={item.id}>
                    • {item.name}: {item.current_stock} {item.unit}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory ({inventory.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Item</th>
                  <th className="text-left py-3 px-4 font-semibold">Unit</th>
                  <th className="text-left py-3 px-4 font-semibold">Max Units</th>
                  <th className="text-left py-3 px-4 font-semibold">Current Stock</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-4 px-4 font-medium">{item.name}</td>
                    <td className="py-4 px-4 font-medium">{item.unit}</td>
                    <td className="py-4 px-4 font-medium">{item.reorder_level}</td>
                    <td className="py-4 px-4 font-semibold">{item.current_stock}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium border ${statusColors[item.status]}`}
                      >
                        {item.status === "good" && "✓ Good"}
                        {item.status === "low" && "⚠ Low"}
                        {item.status === "critical" && "⛔ Critical"}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <Button size="icon" variant="outline" className="w-8 h-8" onClick={() => openEditModal(item)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Item" : "Add Item"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Item name" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Unit */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="unit">Unit</Label>

                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger
                    id="unit"
                    className="border border-input bg-background rounded-md"
                  >
                    <SelectValue placeholder="Select Unit" />
                  </SelectTrigger>

                  <SelectContent>
                    {[
                      "kg", "g", "l", "ml", "pcs", "box", "pack",
                      "tsp", "tbsp", "cup", "oz", "lb"
                    ].map((u) => (
                      <SelectItem key={u} value={u}>
                        {u}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Current Stock */}
              <div className="flex flex-col gap-1">
                <Label htmlFor="current_stock">Current Stock</Label>

                <Input
                  id="current_stock"
                  type="number"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(Number(e.target.value))}
                  className="border border-input bg-background rounded-md"
                />
              </div>
            </div>


            <div className="grid gap-2">
              <Label htmlFor="reorderLevel">Reorder Level <i>{"(Max Units)"}</i></Label>
              <Input
                id="reorderLevel"
                type="number"
                value={reorderLevel ?? ""}
                onChange={(e) => setReorderLevel(Number(e.target.value))}
                placeholder="Optional"
              />
            </div>
          </div>

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button onClick={handleSaveItem}>{editingItem ? "Update" : "Add"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
