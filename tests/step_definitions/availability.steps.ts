import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world';
import { ensureRoom, ensureUser } from './common.steps';

async function occupyRoom(world: CustomWorld, roomName: string, date: string): Promise<void> {
  await ensureRoom(world, roomName);
  const fillerUserId = await ensureUser(world, '__usuario_relleno__');
  await request(world.app).post('/reservations').send({ userId: fillerUserId, roomName, date });
}

Given(
  'que la sala {string} existe y esta disponible el {string}',
  async function (this: CustomWorld, roomName: string, _date: string) {
    await ensureRoom(this, roomName);
  }
);

Given('que la sala {string} esta disponible el {string}', async function (this: CustomWorld, roomName: string, _date: string) {
  await ensureRoom(this, roomName);
});

Given('que la sala {string} esta ocupada el {string}', async function (this: CustomWorld, roomName: string, date: string) {
  await occupyRoom(this, roomName, date);
});

When('se consulta la disponibilidad para el {string}', async function (this: CustomWorld, date: string) {
  this.lastResponse = await request(this.app).get('/rooms/availability').query({ date });
});

Then('la {string} debe aparecer en la lista de disponibles', function (this: CustomWorld, roomName: string) {
  const names = (this.lastResponse?.body ?? []).map((r: { name: string }) => r.name);
  expect(names).to.include(roomName);
});

Then('la {string} no debe aparecer en la lista de disponibles', function (this: CustomWorld, roomName: string) {
  const names = (this.lastResponse?.body ?? []).map((r: { name: string }) => r.name);
  expect(names).to.not.include(roomName);
});

Then(
  'la {string} no debe aparecer en la lista de disponibles para el {string}',
  async function (this: CustomWorld, roomName: string, date: string) {
    const res = await request(this.app).get('/rooms/availability').query({ date });
    const names = res.body.map((r: { name: string }) => r.name);
    expect(names).to.not.include(roomName);
  }
);

Then(
  'la {string} debe volver a aparecer en la lista de disponibles para el {string}',
  async function (this: CustomWorld, roomName: string, date: string) {
    const res = await request(this.app).get('/rooms/availability').query({ date });
    const names = res.body.map((r: { name: string }) => r.name);
    expect(names).to.include(roomName);
  }
);
