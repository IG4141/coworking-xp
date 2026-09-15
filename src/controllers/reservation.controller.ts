import { Router, Request, Response, NextFunction } from 'express';
import { ReservationService } from '../services/reservation.service';

export function reservationController(reservationService: ReservationService): Router {
  const router = Router();

  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, roomName, date } = req.body;
      const reservation = reservationService.reserve(userId, roomName, date);
      res.status(201).json(reservation);
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = req.body;
      const reservation = reservationService.cancel(req.params.id, userId);
      res.status(200).json(reservation);
    } catch (err) {
      next(err);
    }
  });

  return router;
}
