import { createApp } from './app';
import { userRepository } from './repositories/user.repository';
import { roomRepository } from './repositories/room.repository';
import { reservationRepository } from './repositories/reservation.repository';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = createApp({ userRepository, roomRepository, reservationRepository });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor de coworking-xp escuchando en http://localhost:${PORT}`);
});
