import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../src/app';
import { UserRepository } from '../../src/repositories/user.repository';
import { RoomRepository } from '../../src/repositories/room.repository';
import { ReservationRepository } from '../../src/repositories/reservation.repository';

export class CustomWorld extends World {
  app: Express;
  userRepository = new UserRepository();
  roomRepository = new RoomRepository();
  reservationRepository = new ReservationRepository();

  // Datos compartidos entre steps de un mismo escenario.
  lastResponse?: request.Response;
  userIds: Record<string, string> = {};
  reservationIds: Record<string, string> = {};

  constructor(options: IWorldOptions) {
    super(options);
    this.app = createApp({
      userRepository: this.userRepository,
      roomRepository: this.roomRepository,
      reservationRepository: this.reservationRepository
    });
  }
}

setWorldConstructor(CustomWorld);
