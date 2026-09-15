import express, { Express } from 'express';
import { UserRepository } from './repositories/user.repository';
import { RoomRepository } from './repositories/room.repository';
import { ReservationRepository } from './repositories/reservation.repository';
import { AuthService } from './services/auth.service';
import { RoomService } from './services/room.service';
import { ReservationService } from './services/reservation.service';
import { authController } from './controllers/auth.controller';
import { roomController } from './controllers/room.controller';
import { reservationController } from './controllers/reservation.controller';
import { errorHandler } from './middlewares/error-handler';

export interface AppRepositories {
  userRepository: UserRepository;
  roomRepository: RoomRepository;
  reservationRepository: ReservationRepository;
}

// Diseno simple (YAGNI): factory que arma la app a partir de repositorios
// intercambiables. Esto permite reutilizar la misma app en produccion y en
// los tests de Cucumber, reseteando el estado entre escenarios.
export function createApp(repositories: AppRepositories): Express {
  const { userRepository, roomRepository, reservationRepository } = repositories;

  const authService = new AuthService(userRepository);
  const roomService = new RoomService(roomRepository, reservationRepository);
  const reservationService = new ReservationService(reservationRepository, roomRepository, userRepository);

  const app = express();
  app.use(express.json());

  app.use('/auth', authController(authService));
  app.use('/rooms', roomController(roomService, reservationService));
  app.use('/reservations', reservationController(reservationService));

  app.use(errorHandler);

  return app;
}
