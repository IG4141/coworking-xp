export type ReservationStatus = 'CONFIRMED' | 'CANCELLED';

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  date: string; // formato YYYY-MM-DD
  status: ReservationStatus;
}
