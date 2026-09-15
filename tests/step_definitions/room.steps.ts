import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world';

When(
  'el administrador registra la sala {string} con capacidad {int}',
  async function (this: CustomWorld, name: string, capacity: number) {
    this.lastResponse = await request(this.app).post('/rooms').send({ name, capacity });
  }
);

Then('la sala {string} debe quedar registrada exitosamente', function (this: CustomWorld, name: string) {
  expect(this.lastResponse?.status).to.equal(201);
  expect(this.lastResponse?.body.name).to.equal(name);
});

Then('el sistema debe rechazar el registro de la sala', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.be.at.least(400);
});
