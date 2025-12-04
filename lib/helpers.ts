import { Status } from "@/hooks/admin/useInventory";

export const getErrorMessage = (err: unknown): string => {
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message;
  if (typeof err === "object" && err !== null) {
    return (err as any).message || JSON.stringify(err);
  }
  return "Something went wrong";
}

export const getInventoryStatus = (current_stock: number, reorderLevel: number | null | undefined): Status => {
  if (reorderLevel != null && reorderLevel > 0) {
    const ratio = current_stock / reorderLevel
    if (ratio >= 0.6) return "good"
    if (ratio >= 0.3) return "low"
    return "critical"
  }

  // fallback: treat current_stock as percentage
  const ratio = current_stock / 100
  if (ratio >= 0.6) return "good"
  if (ratio >= 0.3) return "low"
  return "critical"
}