import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world';
import { ensureUser, ensureRoom } from './common.steps';

Given(
  '(que ){string} tiene una reserva confirmada de la {string} para el {string}',
  async function (this: CustomWorld, username: string, roomName: string, date: string) {
    const userId = await ensureUser(this, username);
    await ensureRoom(this, roomName);
    const res = await request(this.app).post('/reservations').send({ userId, roomName, date });
    this.reservationIds[username] = res.body.id;
  }
);

When('{string} cancela esa reserva', async function (this: CustomWorld, username: string) {
  const userId = await ensureUser(this, username);
  const reservationId = this.reservationIds[username];
  this.lastResponse = await request(this.app).delete(`/reservations/${reservationId}`).send({ userId });
});

When(
  '{string} intenta cancelar la reserva de {string}',
  async function (this: CustomWorld, cancellingUser: string, ownerUser: string) {
    const userId = await ensureUser(this, cancellingUser);
    const reservationId = this.reservationIds[ownerUser];
    this.lastResponse = await request(this.app).delete(`/reservations/${reservationId}`).send({ userId });
  }
);

Then('la reserva debe quedar cancelada', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.equal(200);
  expect(this.lastResponse?.body.status).to.equal('CANCELLED');
});

Then('el sistema debe rechazar la cancelacion', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.be.at.least(400);
});
