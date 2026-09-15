import { User } from '../models/user.model';

export class UserRepository {
  private users: User[] = [];

  findByUsername(username: string): User | undefined {
    return this.users.find((u) => u.username === username);
  }

  findById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  save(user: User): User {
    this.users.push(user);
    return user;
  }

  reset(): void {
    this.users = [];
  }
}

// Instancia unica (in-memory) compartida por la aplicacion.
export const userRepository = new UserRepository();
