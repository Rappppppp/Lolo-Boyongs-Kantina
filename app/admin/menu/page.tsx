"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import { useMenuItems } from "@/hooks/admin/useMenuItems";
import { AddMenuDialog } from "@/components/add-menu-dialog";
import AdminSkeleton from "@/components/admin-skeleton";

export default function MenuManagementPage() {
  const { items, loading, refetch } = useMenuItems();
  const [openCreate, setOpenCreate] = useState(false);
  const [type, setType] = useState('Add');
  const [selectedItem, setSelectedItem] = useState(null)

  if (loading) return <AdminSkeleton />

  const openItemModal = (type: string, item: any | null) => {
    console.log(item)

    setType(type);
    setSelectedItem(item);
    setOpenCreate(true);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Menu Management</h2>
          <p className="text-muted-foreground">Add, edit, or remove dishes from your menu</p>
        </div>

        <Button className="gap-2" onClick={() => openItemModal('Add', null)}>
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menu Items ({items.length})</CardTitle>
        </CardHeader>
        <CardContent>
 
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold">Item</th>
                    <th className="text-left py-3 px-4 font-semibold">Category</th>
                    <th className="text-left py-3 px-4 font-semibold">Price</th>
                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-muted/30">
                      <td className="py-4 px-4 font-medium">{item.name}</td>
                      <td className="py-4 px-4 text-muted-foreground">{item.category ?? "-"}</td>
                      <td className="py-4 px-4">{item.price}</td>

                      <td className="py-4 px-4 flex gap-2">
                        <Button size="icon" variant="outline" onClick={() => openItemModal('Edit', item)}>
                          <Edit2 className="w-4 h-4" />
                        </Button>

                        <Button size="icon" variant="outline" className="text-destructive">
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

      {/* Create Menu Dialog */}
      <AddMenuDialog item={selectedItem} type={type} open={openCreate} setOpen={setOpenCreate} onSuccess={refetch} />
    </div>
  );
}
