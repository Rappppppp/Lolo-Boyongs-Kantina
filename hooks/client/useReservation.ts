"use client";

import { useState, useCallback } from "react";
import { useApi } from "@/hooks/use-api";
import { toast } from "sonner";
import { CreateReservationPayload, Reservation, UpdateReservationPayload } from "@/app/types/reservations";

export function useReservation() {
  const [loading, setLoading] = useState(false);

  // GET /reservation
  const listApi = useApi<{ data: Reservation[] }>("/reservation");

  // POST /reservation
  const createApi = useApi<{ message: string; reservation: Reservation }>("/reservation");

  // PUT /reservation/:id
  const updateApi = useApi<{ message: string; reservation: Reservation }>("/reservation");

  // DELETE /reservation/:id
  const deleteApi = useApi<{ message: string }>("/reservation");

  // ✅ Fetch reservations
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listApi.callApi();
      return res.data;
    } catch (err: any) {
      toast.error(err?.message || "Failed to fetch reservations");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [listApi]);

  // ✅ Create reservation
  const createReservation = useCallback(
    async (payload: CreateReservationPayload) => {
      setLoading(true);
      try {
        const res = await createApi.callApi({
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
    [createApi]
  );

  // ✅ Update reservation
  const updateReservation = useCallback(
    async (payload: UpdateReservationPayload) => {
      setLoading(true);
      try {
        const res = await updateApi.callApi({
          method: "PUT",
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
    [updateApi]
  );

  // ✅ Delete reservation
  const deleteReservation = useCallback(
    async (reservation_id: number) => {
      setLoading(true);
      try {
        await deleteApi.callApi({
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
    [deleteApi]
  );

  return {
    fetchReservations,
    createReservation,
    updateReservation,
    deleteReservation,
    loading: loading || listApi.loading || createApi.loading || updateApi.loading || deleteApi.loading,
  };
}
