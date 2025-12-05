"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useApi } from "@/hooks/use-api";
import { useStore } from "@/lib/store";
import { useCategories } from "@/hooks/admin/useCategories";
import { useFilepond } from "@/hooks/global/useFilepond";

interface AddMenuDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddMenuDialog({ open, setOpen, onSuccess }: AddMenuDialogProps) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const { callApi, loading } = useApi("/admin/menu-item", "POST");
  const { refresh } = useCategories();
  const { fileUpload } = useFilepond();

  // Zustand store for uploaded blobs
  const { categories, filepondFiles, setFilepondFiles, flushFilepond } = useStore();

  useEffect(() => {
    if (!categories || categories.length === 0) {
      refresh();
    }
  }, [categories]);

  const handleFileUpload = async (files: File[]) => {
    if (!files.length) return;

    const uploadedBlobs: string[] = [];
    for (const file of files) {
      const res = await fileUpload(file);
      if (res?.data?.blob) uploadedBlobs.push(res.data.blob);
    }

    setFilepondFiles(uploadedBlobs);
  };

  const submit = async () => {
    try {
      await callApi({
        body: {
          name,
          category_id: Number(categoryId),
          price: Number(price),
          images: filepondFiles, // send the blob strings
        },
      });

      // flush filepond store
      flushFilepond();

      // close dialog & refresh list
      setOpen(false);
      onSuccess();
    } catch (err) {
      console.error("Failed to add menu item:", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Menu Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger id="categoryId" className="border border-input bg-background rounded-md">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={`${cat.id}`}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* FilePond upload UI */}
          <div className="filepond-wrapper">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileUpload(Array.from(e.target.files ?? []).slice(0, 5))}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Max 5 images. Upload will store temporarily in FilePond (Zustand).
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button disabled={loading} onClick={submit}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
