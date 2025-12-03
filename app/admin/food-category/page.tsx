"use client"

import { useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { useStore } from "@/lib/store";
import { useCategories } from "@/hooks/admin/useCategories";

export default function FoodCategoryPage() {
    const { categories, addCategory: apiAddCategory, loading, error, refresh } = useCategories();
    const { addCategory, updateCategory, removeCategory } = useStore();
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const openAddModal = () => {
        setEditingCategory(null);
        setName("");
        setDescription("");
        setIsOpen(true);
    };

    const openEditModal = (cat: { id: number; name: string; description: string }) => {
        setEditingCategory(cat.id);
        setName(cat.name);
        setDescription(cat.description);
        setIsOpen(true);
    };

    const handleSave = async () => {
        if (!name) return;

        try {
            if (editingCategory !== null) {
                updateCategory(editingCategory, { name, description });
            } else {
                const newCat = await apiAddCategory(name, description); // ✅ fine because hook was called at top
                addCategory(newCat);
            }

            setIsOpen(false);
            setName("");
            setDescription("");
        } catch (err) {
            console.error("Failed to save category", err);
        }
    };


    const handleDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) removeCategory(id);
    };

    if (loading) {
        return (
            <div>
                <div className="flex justify-between mb-3">
                    <div className="space-y-3">
                        <Skeleton className="h-16 w-76" />
                        <Skeleton className="h-10 w-52" />
                    </div>
                    <Skeleton className="h-10 w-68" />
                </div>
                <Skeleton className="h-96 w-full" />
            </div>
        )
    };
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-foreground mb-2">Food Categories</h2>
                    <p className="text-muted-foreground">Manage your food categories</p>
                </div>
                <Button className="gap-2" onClick={openAddModal}>
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Categories ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-border">
                                <tr>
                                    <th className="text-left py-3 px-4 font-semibold">Name</th>
                                    <th className="text-left py-3 px-4 font-semibold">Description</th>
                                    <th className="text-left py-3 px-4 font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map((cat) => (
                                    <tr key={cat.id} className="border-b border-border hover:bg-muted/30 transition">
                                        <td className="py-4 px-4 font-medium">{cat.name}</td>
                                        <td className="py-4 px-4 text-muted-foreground">{cat.description}</td>
                                        <td className="py-4 px-4 flex gap-2">
                                            <Button size="icon" variant="outline" className="w-8 h-8 bg-transparent" onClick={() => openEditModal(cat)}>
                                                <Edit2 className="w-4 h-4" />
                                            </Button>
                                            <Button size="icon" variant="outline" className="w-8 h-8 text-destructive bg-transparent" onClick={() => handleDelete(cat.id)}>
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

            {/* Modal */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingCategory !== null ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Category description" />
                        </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsOpen(false)}>
                            <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                        <Button onClick={handleSave}>{editingCategory !== null ? "Update" : "Add"}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
