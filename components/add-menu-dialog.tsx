"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useApi } from "@/hooks/use-api"
import { useStore } from "@/lib/store"
import { useCategories } from "@/hooks/admin/useCategories"
import { useFilepond } from "@/hooks/global/useFilepond"
import { X, Upload, ImageIcon, Star, TagIcon, Loader2 } from "lucide-react"
import { useToast } from "./ui/use-toast"

interface AddMenuDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onSuccess: () => void
  type: string
  item: any | null
}

interface FilepondUpload {
  blob: string
  directory: string
  file_extension: string
  remarks: string
  path: string | null
}

interface FilepondResponse {
  message: string
  files: FilepondUpload[]
  token_expires_in: number
}

export function AddMenuDialog({
  open,
  setOpen,
  onSuccess,
  type = 'Add',
  item = null
}: AddMenuDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [price, setPrice] = useState("")
  const [isBestseller, setIsBestseller] = useState(false)
  const [isAvailable, setIsAvailable] = useState(true)
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<FilepondUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const { toast } = useToast();

  const { callApi, loading } = useApi("/admin/menu-item", "POST")
  const { refresh } = useCategories()
  const { fileUpload } = useFilepond()

  // Zustand store
  const { categories, filepondFiles, setFilepondFiles, flushFilepond } = useStore()

  useEffect(() => {
    if (!categories || categories.length === 0) {
      refresh()
    }
  }, [categories])

  useEffect(() => {
    console.log(item)

    if (!item) {
      resetForm();
      return;
    }

    setName(item.name ?? "");
    setDescription(item.description ?? "");
    setCategoryId(String(item.category_id ?? ""));
    setPrice(String(item.price ?? ""));
    setIsBestseller(!!item.is_bestseller);
    setIsAvailable(!!item.is_active);
    setUploadedFiles(item.images ?? []);
  }, [item])

  const handleFileUpload = async (files: File[]) => {
    if (!files.length) return

    if (files.length > 5) return toast({
      title: "Failed to upload images",
      description: "You can only upload up to 5 images at a time",
      variant: "destructive",
    })

    setIsUploading(true)
    try {
      const result = await fileUpload(files)

      if (!result?.files || !Array.isArray(result.files)) {
        console.error("[v0] No files in response:", result)
        return
      }

      const newUploads: FilepondUpload[] = result.files

      setUploadedFiles((prev) => [...prev, ...newUploads])

      // Store blob strings for API submission
      const blobs = newUploads.map((upload) => upload.blob)
      setFilepondFiles([...filepondFiles, ...blobs])
    } catch (err) {
      console.error("[v0] Failed to upload files:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (blob: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.blob !== blob))
    setFilepondFiles(filepondFiles.filter((b) => b !== blob))
  }

  const addTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addTag()
    }
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setCategoryId("")
    setPrice("")
    setIsBestseller(false)
    setIsAvailable(true)
    setTags([])
    setTagInput("")
    setUploadedFiles([])
    flushFilepond()
  }

  const submit = async () => {
    try {
      await callApi({
        body: {
          name,
          description,
          category_id: Number(categoryId),
          price: Number(price),
          is_bestseller: isBestseller,
          is_active: isAvailable,
          // tags,
          images: filepondFiles, // Array of blob strings
        },
      })

      resetForm()
      setOpen(false)
      onSuccess()
    } catch (err) {
      console.error("Failed to add menu item:", err)
    }
  }

  const isFormValid = name.trim() && categoryId && price && !isNaN(Number(price))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{type} Menu Item</DialogTitle>
          <DialogDescription>Create a new menu item with images, pricing, and details</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Margherita Pizza"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your menu item..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          {/* Category and Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={`${cat.id}`}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                placeholder="0.00"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Tags */}
          {/* <div className="space-y-2">
            <Label htmlFor="tags">
              <TagIcon className="inline-block w-4 h-4 mr-1" />
              Tags
            </Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                placeholder="Add a tag and press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div> */}

          {/* Settings */}
          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="bestseller" className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Bestseller
                </Label>
                <p className="text-sm text-muted-foreground">Mark this item as a customer favorite</p>
              </div>
              <Switch id="bestseller" checked={isBestseller} onCheckedChange={setIsBestseller} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="available">Available</Label>
                <p className="text-sm text-muted-foreground">Item is in stock and can be ordered</p>
              </div>
              <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <Label>
              <ImageIcon className="inline-block w-4 h-4 mr-1" />
              Images
            </Label>
            <div className="space-y-3">
              {/* Upload Button */}
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files ?? []).slice(0, 5))}
                  className="hidden"
                  id="file-upload"
                  disabled={isUploading || uploadedFiles.length >= 5}
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">

                  {isUploading ? <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /> : <Upload className="w-8 h-8 text-muted-foreground" />}
                  <div>
                    <p className="text-sm font-medium">{isUploading ? "Uploading..." : "Click to upload images"}</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB (Max 5 images)</p>
                  </div>
                </label>
              </div>

              {/* Image Previews */}
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.blob}
                      className="relative group aspect-square rounded-lg overflow-hidden border border-border bg-muted"
                    >
                      <img
                        src={type === 'Edit' ? `${process.env.NEXT_PUBLIC_APP_URL}/storage/images/${file.path}` : `${process.env.NEXT_PUBLIC_APP_URL}/storage/filepond/${file.blob}`}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(file.blob)}
                        className="cursor-pointer absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetForm()
              setOpen(false)
            }}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={loading || !isFormValid}>
            {loading ? 
              `${type == 'Edit' ?
                 'Editing' :
                 'Creating'}...` 
                 : `
                 ${type == 'Edit' ?
                  'Edit' :
                   'Create'} Menu Item`
                   }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
