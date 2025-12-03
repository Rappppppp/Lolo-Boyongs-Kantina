"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2 } from "lucide-react"

const menuItems = [
  { id: 1, name: "Truffle Dumplings", category: "Appetizers", price: 12.99, stock: 45 },
  { id: 2, name: "Pan-Seared Salmon", category: "Main Courses", price: 24.99, stock: 12 },
  { id: 3, name: "Chocolate Lava Cake", category: "Desserts", price: 8.99, stock: 28 },
  { id: 4, name: "Crispy Spring Rolls", category: "Appetizers", price: 8.99, stock: 0 },
  { id: 5, name: "Wagyu Beef Steak", category: "Main Courses", price: 32.99, stock: 8 },
]

export default function MenuManagementPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Menu Management</h2>
          <p className="text-muted-foreground">Add, edit, or remove dishes from your menu</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({menuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Item</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Category</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Price</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Stock</th>
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="py-4 px-4 text-foreground font-medium">{item.name}</td>
                    <td className="py-4 px-4 text-muted-foreground">{item.category}</td>
                    <td className="py-4 px-4 text-foreground">${item.price}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          item.stock === 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                        }`}
                      >
                        {item.stock > 0 ? `${item.stock} units` : "Out of Stock"}
                      </span>
                    </td>
                    <td className="py-4 px-4 flex gap-2">
                      <Button size="icon" variant="outline" className="w-8 h-8 bg-transparent">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="outline" className="w-8 h-8 text-destructive bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
