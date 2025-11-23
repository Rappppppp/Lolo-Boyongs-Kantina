"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Plus, Edit2, AlertTriangle } from "lucide-react"

const inventoryItems = [
  {
    id: 1,
    name: "Truffle Dumplings",
    stock: 45,
    reserved: 12,
    reorderLevel: 20,
    unit: "portions",
    status: "good",
    supplier: "Local Farm",
  },
  {
    id: 2,
    name: "Pan-Seared Salmon",
    stock: 12,
    reserved: 5,
    reorderLevel: 15,
    unit: "fillets",
    status: "low",
    supplier: "Fresh Seafood Co",
  },
  {
    id: 3,
    name: "Chocolate Lava Cake",
    stock: 28,
    reserved: 8,
    reorderLevel: 10,
    unit: "servings",
    status: "good",
    supplier: "Artisan Bakery",
  },
  {
    id: 4,
    name: "Crispy Spring Rolls",
    stock: 0,
    reserved: 0,
    reorderLevel: 25,
    unit: "pieces",
    status: "critical",
    supplier: "Asian Foods",
  },
  {
    id: 5,
    name: "Wagyu Beef Steak",
    stock: 8,
    reserved: 3,
    reorderLevel: 10,
    unit: "portions",
    status: "critical",
    supplier: "Premium Meats",
  },
  {
    id: 6,
    name: "Wild Mushrooms",
    stock: 33,
    reserved: 7,
    reorderLevel: 15,
    unit: "lbs",
    status: "good",
    supplier: "Local Farm",
  },
  {
    id: 7,
    name: "Sea Urchin Roe",
    stock: 5,
    reserved: 2,
    reorderLevel: 8,
    unit: "lbs",
    status: "low",
    supplier: "Seafood Imports",
  },
]

const statusColors = {
  good: "bg-green-100 text-green-800 border-green-300",
  low: "bg-yellow-100 text-yellow-800 border-yellow-300",
  critical: "bg-red-100 text-red-800 border-red-300",
}

export default function InventoryPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  const lowStockItems = inventoryItems.filter((item) => item.stock <= item.reorderLevel)
  const criticalItems = inventoryItems.filter((item) => item.status === "critical")
  const totalValue = inventoryItems.reduce((sum, item) => sum + item.stock * 15, 0) // Assuming avg value of $15

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">Inventory Management</h2>
        <p className="text-muted-foreground">Monitor stock levels, track items, and manage reorders</p>
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

      {/* Added critical alert notifications */}
      {criticalItems.length > 0 && (
        <Card className="mb-8 bg-red-50 border-red-200">
          <CardContent className="p-6 flex gap-4">
            <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Critical Stock Alert!</h3>
              <p className="text-red-800 text-sm mb-2">
                {criticalItems.length} item(s) are out of stock or critically low. Immediate reorder recommended.
              </p>
              <div className="text-sm text-red-700 space-y-1">
                {criticalItems.map((item) => (
                  <div key={item.id}>
                    • {item.name}: {item.stock} {item.unit}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground mb-2">{inventoryItems.length}</div>
            <p className="text-muted-foreground text-sm">Total Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground mb-2">
              {inventoryItems.reduce((sum, item) => sum + item.stock, 0)}
            </div>
            <p className="text-muted-foreground text-sm">Total Units in Stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-foreground mb-2">
              {inventoryItems.reduce((sum, item) => sum + item.reserved, 0)}
            </div>
            <p className="text-muted-foreground text-sm">Items Reserved</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="text-3xl font-bold text-orange-600 mb-2">${totalValue.toFixed(2)}</div>
            <p className="text-muted-foreground text-sm">Est. Inventory Value</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Inventory Levels</CardTitle>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Item</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">In Stock</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Reserved</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Available</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Reorder Level</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Supplier</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Status</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-4 px-4 text-foreground font-medium">{item.name}</td>
                    <td className="py-4 px-4 text-foreground">
                      {item.stock} {item.unit}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{item.reserved}</td>
                    <td className="py-4 px-4 font-semibold text-foreground">
                      {Math.max(0, item.stock - item.reserved)}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{item.reorderLevel}</td>
                    <td className="py-4 px-4 text-muted-foreground text-xs">{item.supplier}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium border ${statusColors[item.status as keyof typeof statusColors]}`}
                      >
                        {item.status === "good" && "✓ Good"}
                        {item.status === "low" && "⚠ Low"}
                        {item.status === "critical" && "⛔ Critical"}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Button size="icon" variant="outline" className="w-8 h-8 bg-transparent">
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

      {/* Reorder Form */}
      <Card>
        <CardHeader>
          <CardTitle>Place Reorder Request</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Critical & Low Stock Items ({lowStockItems.length})
              </label>
              {lowStockItems.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {lowStockItems.map((item) => (
                    <label
                      key={item.id}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/30 transition"
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded cursor-pointer"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedItems([...selectedItems, item.id])
                          } else {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id))
                          }
                        }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Current: {item.stock} {item.unit} • Reorder Level: {item.reorderLevel}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">{item.supplier}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">All items are well stocked</p>
                </div>
              )}
            </div>

            {lowStockItems.length > 0 && (
              <Button className="w-full">
                Reorder {selectedItems.length} Item{selectedItems.length !== 1 ? "s" : ""}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
