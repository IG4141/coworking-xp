export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
}
