import { Router, Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export function authController(authService: AuthService): Router {
  const router = Router();

  router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, role } = req.body;
      const user = await authService.register(username, password, role);
      res.status(201).json({ id: user.id, username: user.username, role: user.role });
    } catch (err) {
      next(err);
    }
  });

  router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body;
      const user = await authService.login(username, password);
      res.status(200).json({ id: user.id, username: user.username, role: user.role });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
