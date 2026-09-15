import { v4 as uuid } from 'uuid';
import { Reservation } from '../models/reservation.model';
import { ReservationRepository } from '../repositories/reservation.repository';
import { RoomRepository } from '../repositories/room.repository';
import { UserRepository } from '../repositories/user.repository';
import { ConflictError, NotFoundError, UnauthorizedError } from './errors';

export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly roomRepository: RoomRepository,
    private readonly userRepository: UserRepository
  ) {}

  reserve(userId: string, roomName: string, date: string): Reservation {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundError('Usuario no encontrado');
    }

    const room = this.roomRepository.findByName(roomName);
    if (!room) {
      throw new NotFoundError(`La sala "${roomName}" no existe`);
    }

    const existing = this.reservationRepository.findByRoomAndDate(room.id, date);
    if (existing) {
      throw new ConflictError('Sala no disponible');
    }

    const reservation: Reservation = {
      id: uuid(),
      roomId: room.id,
      userId,
      date,
      status: 'CONFIRMED'
    };

    return this.reservationRepository.save(reservation);
  }

  cancel(reservationId: string, userId: string): Reservation {
    const reservation = this.reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new NotFoundError('Reserva no encontrada');
    }
    if (reservation.userId !== userId) {
      throw new UnauthorizedError('No puede cancelar una reserva que no le pertenece');
    }

    reservation.status = 'CANCELLED';
    return reservation;
  }

  historyByRoomName(roomName: string): Reservation[] {
    const room = this.roomRepository.findByName(roomName);
    if (!room) {
      throw new NotFoundError(`La sala "${roomName}" no existe`);
    }
    return this.reservationRepository.findByRoom(room.id);
  }
}
