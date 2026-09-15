import { v4 as uuid } from 'uuid';
import { Room } from '../models/room.model';
import { RoomRepository } from '../repositories/room.repository';
import { ReservationRepository } from '../repositories/reservation.repository';
import { ConflictError } from './errors';

export class RoomService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly reservationRepository: ReservationRepository
  ) {}

  createRoom(name: string, capacity: number): Room {
    if (this.roomRepository.findByName(name)) {
      throw new ConflictError(`La sala "${name}" ya existe`);
    }

    const room: Room = { id: uuid(), name, capacity };
    return this.roomRepository.save(room);
  }

  listRooms(): Room[] {
    return this.roomRepository.findAll();
  }

  // Disponibilidad = salas que NO tienen una reserva confirmada en esa fecha.
  getAvailability(date: string): Room[] {
    return this.roomRepository
      .findAll()
      .filter((room) => !this.reservationRepository.findByRoomAndDate(room.id, date));
  }

  isAvailable(roomId: string, date: string): boolean {
    return !this.reservationRepository.findByRoomAndDate(roomId, date);
  }
}
