# Decisiones de Diseño (XP)

Este documento registra las decisiones tomadas durante el desarrollo, siguiendo el
espíritu de XP de mantener el diseño visible y justificado en cada paso.

## Fase 1 — Historias de Usuario
- Se eligió el dominio de **reservas de coworking** por tener el menor número de
  entidades cruzadas (Usuario, Sala, Reserva) sin perder complejidad de negocio real
  (concurrencia sobre el mismo recurso, dueño de una reserva, roles).
- Se definieron 7 historias funcionales y 2 no funcionales (ver `BACKLOG.md`).

## Fase 2 — BDD con Cucumber
- Cada historia funcional tiene su propio archivo `.feature`, con al menos un escenario
  de camino feliz y uno de error, tal como pide la consigna.
- Se usó un `World` personalizado (`tests/support/world.ts`) que crea una instancia nueva
  de la app Express con repositorios en memoria **por escenario**, evitando que un
  escenario contamine el estado de otro (aislamiento de tests, práctica de diseño simple).
- Los steps llaman a la API real a través de `supertest`, no a los servicios directamente.
  Esto valida de punta a punta la capa HTTP, no solo la lógica de negocio.
- Durante el desarrollo, los primeros escenarios se dejaron correr sin implementación
  (fase RED): fallaban con "step undefined" o aserciones fallidas. Recién después se
  escribió el código de `src/` necesario para pasarlos (fase GREEN).

## Fase 3 — Backend y prácticas XP

### Diseño simple (YAGNI)
- Persistencia en **memoria** (arrays dentro de clases `Repository`) en lugar de una base
  de datos real. La consigna lo permite explícitamente y evita sobreingeniería para un
  proyecto académico: no se necesita Postgres/Mongo para demostrar BDD + XP.
- Los repositorios se inyectan por constructor en los servicios (`AuthService`,
  `RoomService`, `ReservationService`), y estos se inyectan en los controladores desde
  `src/app.ts`. Esto es lo mínimo necesario para poder crear una app nueva con
  repositorios "limpios" en cada test de Cucumber, sin duplicar lógica.

### Separación de capas
- `controllers/`: solo reciben el `Request`, llaman al servicio correspondiente y
  traducen el resultado (o el error) a una respuesta HTTP.
- `services/`: contienen toda la lógica de negocio y las reglas de validación
  (¿existe el usuario?, ¿está la sala disponible?, ¿es dueño de la reserva?).
- `repositories/`: acceso a los datos, sin ninguna regla de negocio.
- Errores de dominio (`DomainError`, `NotFoundError`, `ConflictError`, `UnauthorizedError`)
  viajan desde los servicios hasta un middleware central (`error-handler.ts`) que decide
  el código HTTP. Así los controladores no tienen `if` repetidos para mapear errores.

### Seguridad (HU-08)
- Las contraseñas se hashean con `bcrypt` (10 salt rounds) en `AuthService.register`.
  Nunca se compara ni se guarda la contraseña en texto plano.

### Rendimiento (HU-09)
- No se agregó una base de datos externa ni I/O de red en el camino crítico de lectura,
  precisamente para no introducir latencia innecesaria en una entrega académica. La capa
  de repositorio está aislada detrás de una interfaz simple para que, en un entorno real,
  pueda reemplazarse por Prisma/TypeORM sin tocar servicios ni controladores.

### Refactorización continua
- Los errores de dominio se centralizaron en `services/errors.ts` después de notar que
  los primeros controladores repetían bloques `try/catch` con mapeos de código HTTP
  distintos para casos similares (ejemplo: "no encontrado" en salas, usuarios y reservas).
- Se extrajeron funciones auxiliares reutilizables (`ensureUser`, `ensureRoom`) en
  `tests/step_definitions/common.steps.ts` tras notar que varios `Given` de distintos
  `.feature` necesitaban la misma precondición ("que tal usuario/sala exista").

## Integración Continua
- El pipeline (`.github/workflows/main.yml`) corre en cada push/PR: instalación de
  dependencias, lint, compilación TypeScript estricta y la suite completa de Cucumber.
  Si cualquiera de esos pasos falla, el pipeline falla — esto obliga a que el código en
  la rama principal siempre esté en estado "verde".
