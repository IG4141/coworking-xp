import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { ConflictError, UnauthorizedError } from './errors';

const SALT_ROUNDS = 10;

export class AuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async register(username: string, password: string, role: 'USER' | 'ADMIN' = 'USER'): Promise<User> {
    if (this.userRepository.findByUsername(username)) {
      throw new ConflictError(`El usuario "${username}" ya existe`);
    }

    // Requisito no funcional de seguridad: hashing con bcrypt + salting.
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user: User = {
      id: uuid(),
      username,
      passwordHash,
      role
    };

    return this.userRepository.save(user);
  }

  async login(username: string, password: string): Promise<User> {
    const user = this.userRepository.findByUsername(username);
    if (!user) {
      throw new UnauthorizedError('Usuario o contrasena invalidos');
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError('Usuario o contrasena invalidos');
    }

    return user;
  }
}
