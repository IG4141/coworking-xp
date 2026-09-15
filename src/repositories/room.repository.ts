import { Room } from '../models/room.model';

export class RoomRepository {
  private rooms: Room[] = [];

  findAll(): Room[] {
    return this.rooms;
  }

  findById(id: string): Room | undefined {
    return this.rooms.find((r) => r.id === id);
  }

  findByName(name: string): Room | undefined {
    return this.rooms.find((r) => r.name === name);
  }

  save(room: Room): Room {
    this.rooms.push(room);
    return room;
  }

  reset(): void {
    this.rooms = [];
  }
}

export const roomRepository = new RoomRepository();
