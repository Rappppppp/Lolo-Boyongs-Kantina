"use client";

import { Dialog, DialogTitle, DialogDescription, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { MenuItem, useMenuItems } from "@/hooks/admin/useMenuItems";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface DeleteMenuItemProps {
  menuItem: MenuItem | null;
  isDeleteMenuItemDialogOpen: boolean;
  setIsDeleteMenuItemDialogOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedMenuItem: Dispatch<SetStateAction<MenuItem | null>>;
  onSuccess: () => void; // callback after deletion
}

export default function DeleteMenuItem({
  menuItem,
  isDeleteMenuItemDialogOpen,
  setIsDeleteMenuItemDialogOpen,
  setSelectedMenuItem,
  onSuccess
}: DeleteMenuItemProps) {
  const { loading, deleteMenuItem } = useMenuItems();

  const handleConfirmAction = async () => {
    if (!menuItem) return;

    await deleteMenuItem(menuItem.id);

    toast.success("Menu item deleted successfully");
    setIsDeleteMenuItemDialogOpen(false);
    setSelectedMenuItem(null);

    onSuccess(); // refetch in parent
  };

  return (
    <Dialog open={isDeleteMenuItemDialogOpen} onOpenChange={setIsDeleteMenuItemDialogOpen}>
      <DialogContent>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete {menuItem?.name}?
        </DialogDescription>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsDeleteMenuItemDialogOpen(false)}>
            Close
          </Button>
          <Button variant="destructive" size="sm" onClick={handleConfirmAction} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Delete Menu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
