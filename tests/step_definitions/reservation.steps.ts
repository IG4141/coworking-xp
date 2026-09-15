import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world';
import { ensureUser } from './common.steps';

Given('el usuario {string} existe en el sistema', async function (this: CustomWorld, username: string) {
  await ensureUser(this, username);
});

When(
  '{string} intenta reservar la {string} para el {string}',
  async function (this: CustomWorld, username: string, roomName: string, date: string) {
    const userId = await ensureUser(this, username);
    this.lastResponse = await request(this.app).post('/reservations').send({ userId, roomName, date });
    if (this.lastResponse.status === 201) {
      this.reservationIds[username] = this.lastResponse.body.id;
    }
  }
);

Then('la reserva debe confirmarse exitosamente', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.equal(201);
  expect(this.lastResponse?.body.status).to.equal('CONFIRMED');
});

Then('el sistema debe rechazar la reserva', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.be.at.least(400);
});
