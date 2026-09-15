import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world';

When('el administrador consulta el historial de la {string}', async function (this: CustomWorld, roomName: string) {
  this.lastResponse = await request(this.app).get(`/rooms/${encodeURIComponent(roomName)}/history`);
});

Then('el historial debe contener {int} reserva', function (this: CustomWorld, count: number) {
  expect(this.lastResponse?.status).to.equal(200);
  expect(this.lastResponse?.body.length).to.equal(count);
});

Then('el sistema debe rechazar la consulta de historial', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.be.at.least(400);
});
