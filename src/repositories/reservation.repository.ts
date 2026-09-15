import { Reservation } from '../models/reservation.model';

export class ReservationRepository {
  private reservations: Reservation[] = [];

  findById(id: string): Reservation | undefined {
    return this.reservations.find((r) => r.id === id);
  }

  findByRoomAndDate(roomId: string, date: string): Reservation | undefined {
    return this.reservations.find(
      (r) => r.roomId === roomId && r.date === date && r.status === 'CONFIRMED'
    );
  }

  findByRoom(roomId: string): Reservation[] {
    return this.reservations.filter((r) => r.roomId === roomId);
  }

  save(reservation: Reservation): Reservation {
    this.reservations.push(reservation);
    return reservation;
  }

  reset(): void {
    this.reservations = [];
  }
}

export const reservationRepository = new ReservationRepository();
