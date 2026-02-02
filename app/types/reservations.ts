export type Reservation = {
  id: number;
  guests: number;
  date: string;
  time: string;
  status: string;
  created_at: string;
  updated_at: string;
};

export interface CreateReservationPayload {
  guests: number;
  date: string;
  time: string;
}

export interface UpdateReservationPayload {
  reservation_id: number;
  guests?: number;
  date?: string;
  time?: string;
  status?: string;
}