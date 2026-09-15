import { When, Then } from '@cucumber/cucumber';
import { expect } from 'chai';
import request from 'supertest';
import { CustomWorld } from '../support/world';

When('{string} se registra con la contrasena {string}', async function (this: CustomWorld, username: string, password: string) {
  this.lastResponse = await request(this.app).post('/auth/register').send({ username, password });
  if (this.lastResponse.status === 201) {
    this.userIds[username] = this.lastResponse.body.id;
  }
});

When('{string} inicia sesion con la contrasena {string}', async function (this: CustomWorld, username: string, password: string) {
  this.lastResponse = await request(this.app).post('/auth/login').send({ username, password });
});

Then('el usuario {string} debe quedar registrado exitosamente', function (this: CustomWorld, username: string) {
  expect(this.lastResponse?.status).to.equal(201);
  expect(this.lastResponse?.body.username).to.equal(username);
});

Then('la contrasena almacenada de {string} no debe ser texto plano', function (this: CustomWorld, username: string) {
  const user = this.userRepository.findByUsername(username);
  expect(user).to.not.be.undefined;
  expect(user!.passwordHash).to.not.equal('clave1234');
  expect(user!.passwordHash.startsWith('$2b$')).to.equal(true);
});

Then('el sistema debe rechazar el registro', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.be.at.least(400);
});

Then('el inicio de sesion debe ser exitoso', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.equal(200);
});

Then('el sistema debe rechazar el inicio de sesion', function (this: CustomWorld) {
  expect(this.lastResponse?.status).to.equal(401);
});

Then('debe mostrar el mensaje de error {string}', function (this: CustomWorld, message: string) {
  expect(this.lastResponse?.body.error).to.equal(message);
});
