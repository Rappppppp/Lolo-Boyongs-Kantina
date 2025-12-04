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
import { useToast } from "@/components/ui/use-toast";

import { useStore } from "@/lib/store";
import { getErrorMessage } from "@/lib/helpers";

import { useCategories } from "@/hooks/admin/useCategories";
import AdminSkeleton from "@/components/admin-skeleton";

export default function FoodCategoryPage() {
    const { categories, addCategory, updateCategory, loading, error, refresh } = useCategories();
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<number | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const { toast } = useToast();

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
            setIsOpen(false);
            setName("");
            setDescription("");

            if (editingCategory !== null) {
                await updateCategory(editingCategory, name, description);
            } else {
                await addCategory(name, description);
            }
        } catch (err) {
            console.error("Failed to save category", err);
            toast({
                title: "Failed to save category",
                description: getErrorMessage(err),
                variant: "destructive",
            });
        }
    };

    if (loading) return <AdminSkeleton />
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
                                    <th className="text-left py-3 px-4 font-semibold">Update</th>
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
