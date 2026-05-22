"use client";

import { useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { toast } from "sonner";
import { CreateReservationPayload, Reservation, UpdateReservationPayload } from "@/app/types/reservations";

export function useReservation() {
  const [loading, setLoading] = useState(false);

  // Destructure stable callApi references from each API instance
  const { callApi: listCallApi } = useApi<{ data: Reservation[] }>("/reservation");
  const { callApi: createCallApi } = useApi<{ message: string; reservation: Reservation }>("/reservation");
  const { callApi: updateCallApi } = useApi<{ message: string; reservation: Reservation }>("/reservation");
  const { callApi: deleteCallApi } = useApi<{ message: string }>("/reservation");

  // ✅ Fetch reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCallApi();
      return res.data;
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch reservations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listCallApi]);

  // ✅ Create reservation
  const createReservation = useCallback(
    async (payload: CreateReservationPayload) => {
      setLoading(true);
      try {
        const res = await createCallApi({
          method: "POST",
          body: payload,
        });
        toast.success("Reservation created successfully!");
        return res.reservation;
      } catch (err: any) {
        toast.error(err?.message || "Failed to create reservation");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createCallApi]
  );

  // ✅ Update reservation
  const updateReservation = useCallback(
    async (payload: UpdateReservationPayload & { reservation_id: number }) => {
      setLoading(true);
      try {
        const res = await updateCallApi({
          method: "PUT",
          urlOverride: `/reservation/${payload.reservation_id}`,
          body: payload,
        });
        toast.success("Reservation updated successfully!");
        return res.reservation;
      } catch (err: any) {
        toast.error(err?.message || "Failed to update reservation");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateCallApi]
  );

  // ✅ Delete reservation
  const deleteReservation = useCallback(
    async (reservation_id: number) => {
      setLoading(true);
      try {
        await deleteCallApi({
          method: "DELETE",
          body: { reservation_id },
        });
        toast.success("Reservation deleted successfully!");
      } catch (err: any) {
        toast.error(err?.message || "Failed to delete reservation");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [deleteCallApi]
  );

  return {
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    loading,
  };
}
