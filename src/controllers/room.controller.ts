import { Router, Request, Response, NextFunction } from 'express';
import { RoomService } from '../services/room.service';
import { ReservationService } from '../services/reservation.service';

export function roomController(roomService: RoomService, reservationService: ReservationService): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, capacity } = req.body;
      const room = roomService.createRoom(name, capacity);
      res.status(201).json(room);
    } catch (err) {
      next(err);
    }
  });

  router.get('/', (_req: Request, res: Response) => {
    res.status(200).json(roomService.listRooms());
  });

  router.get('/availability', (req: Request, res: Response, next: NextFunction) => {
    try {
      const date = String(req.query.date);
      res.status(200).json(roomService.getAvailability(date));
    } catch (err) {
      next(err);
    }
  });

  router.get('/:name/history', (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = reservationService.historyByRoomName(req.params.name);
      res.status(200).json(history);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
