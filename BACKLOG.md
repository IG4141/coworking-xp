# Backlog del Producto — Coworking XP

Dominio elegido: **gestión de reservas de un espacio de coworking**, con tres entidades
centrales: `Usuario`, `Sala` y `Reserva`.

## Historias de Usuario Funcionales

### HU-01: Registro de usuario
**Como** usuario nuevo, **quiero** registrarme en el sistema **para** poder reservar salas.

Criterios de aceptación:
- Dado un nombre de usuario que no existe, el registro debe crear el usuario y devolver un `201`.
- Si el nombre de usuario ya existe, el sistema debe rechazar el registro con un error `409`.
- La contraseña nunca debe guardarse en texto plano (ver HU-08, requisito no funcional de seguridad).

### HU-02: Inicio de sesión
**Como** usuario registrado, **quiero** iniciar sesión **para** acceder al sistema de forma segura.

Criterios de aceptación:
- Con usuario y contraseña correctos, el login responde `200` y devuelve los datos del usuario.
- Con contraseña incorrecta o usuario inexistente, el login responde `401` sin revelar cuál de los dos datos falló.

### HU-03: Registro de salas
**Como** administrador, **quiero** registrar nuevas salas **para** ampliar la oferta del coworking.

Criterios de aceptación:
- Una sala nueva (nombre no repetido) se crea correctamente y responde `201`.
- Si ya existe una sala con ese nombre, el sistema rechaza la creación con `409`.

### HU-04: Consulta de disponibilidad
**Como** usuario registrado, **quiero** ver la disponibilidad de salas por fecha **para** elegir un horario libre.

Criterios de aceptación:
- La consulta por fecha devuelve únicamente las salas sin una reserva confirmada ese día.
- Una sala con una reserva confirmada en esa fecha no debe aparecer en el listado de disponibles.

### HU-05: Reserva de una sala
**Como** usuario registrado, **quiero** reservar una sala de reuniones **para** tener un lugar privado de trabajo.

Criterios de aceptación:
- Si la sala está disponible en la fecha pedida, la reserva se confirma (`201`, estado `CONFIRMED`).
- Si la sala ya está ocupada esa fecha, la reserva se rechaza (`409`) con el mensaje "Sala no disponible".
- Tras confirmarse, la sala deja de figurar como disponible para esa fecha.

### HU-06: Cancelación de una reserva
**Como** usuario registrado, **quiero** cancelar una reserva **para** liberar el espacio si cambian mis planes.

Criterios de aceptación:
- El dueño de la reserva puede cancelarla; el estado pasa a `CANCELLED` y la sala vuelve a estar disponible ese día.
- Un usuario distinto al dueño no puede cancelarla (`401`, mensaje "No puede cancelar una reserva que no le pertenece").

### HU-07: Historial de reservas por sala
**Como** administrador, **quiero** ver el historial de reservas de una sala **para** controlar el uso del espacio.

Criterios de aceptación:
- Consultar el historial de una sala existente devuelve todas sus reservas (confirmadas y canceladas).
- Consultar el historial de una sala inexistente responde `404` con un mensaje de error claro.

## Historias de Usuario No Funcionales / Técnicas

### HU-08: Seguridad de contraseñas
**Como** auditor de seguridad, **quiero** que todas las contraseñas se almacenen usando hashing con
bcrypt y salting **para** proteger los datos en caso de una brecha.

Criterios de aceptación:
- Ninguna contraseña se persiste en texto plano en ningún repositorio.
- El hash generado usa bcrypt con al menos 10 salt rounds.

### HU-09: Tiempo de respuesta de la API
**Como** administrador del sistema, **quiero** que los endpoints de la API respondan en menos de
200ms bajo condiciones normales **para** garantizar una experiencia fluida bajo concurrencia.

Criterios de aceptación:
- Los endpoints de lectura (disponibilidad, historial) no dependen de operaciones bloqueantes costosas.
- La arquitectura en capas (controlador → servicio → repositorio) permite reemplazar el
  repositorio en memoria por uno con base de datos real sin tocar la lógica de negocio ni los
  controladores, para poder optimizar sin reescribir el sistema.
