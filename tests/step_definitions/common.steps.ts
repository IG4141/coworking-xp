import { Given } from '@cucumber/cucumber';
import request from 'supertest';
import { CustomWorld } from '../support/world';

const DEFAULT_PASSWORD = 'defaultPass123';

export async function registerUser(world: CustomWorld, username: string, password: string): Promise<string> {
  const res = await request(world.app).post('/auth/register').send({ username, password });
  world.userIds[username] = res.body.id;
  return res.body.id;
}

export async function ensureUser(world: CustomWorld, username: string, password = DEFAULT_PASSWORD): Promise<string> {
  if (world.userIds[username]) {
    return world.userIds[username];
  }
  return registerUser(world, username, password);
}

export async function ensureRoom(world: CustomWorld, name: string, capacity = 4): Promise<void> {
  if (!world.roomRepository.findByName(name)) {
    await request(world.app).post('/rooms').send({ name, capacity });
  }
}

Given('que no existe un usuario con nombre {string}', function (this: CustomWorld, username: string) {
  // Precondicion documental: el repositorio arranca vacio en cada escenario.
  if (this.userRepository.findByUsername(username)) {
    throw new Error(`Se esperaba que "${username}" no existiera`);
  }
});

Given('que existe un usuario registrado con nombre {string}', async function (this: CustomWorld, username: string) {
  await ensureUser(this, username);
});

Given(
  'que existe un usuario registrado con nombre {string} y contrasena {string}',
  async function (this: CustomWorld, username: string, password: string) {
    await registerUser(this, username, password);
  }
);

Given('que no existe una sala llamada {string}', function (this: CustomWorld, name: string) {
  if (this.roomRepository.findByName(name)) {
    throw new Error(`Se esperaba que la sala "${name}" no existiera`);
  }
});

Given('que existe una sala llamada {string}', async function (this: CustomWorld, name: string) {
  await ensureRoom(this, name);
});

Given('que la sala {string} existe', async function (this: CustomWorld, name: string) {
  await ensureRoom(this, name);
});
