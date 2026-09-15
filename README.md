# Coworking XP — Backend de Reservas con prácticas de Extreme Programming

Backend en TypeScript para la gestión de reservas de un espacio de coworking, desarrollado
aplicando prácticas de **Extreme Programming (XP)** con **BDD** (Cucumber) como guía del
desarrollo.

## Stack técnico
- **TypeScript** (modo `strict`)
- **Express** para la API REST
- **Cucumber.js** para BDD (Gherkin + step definitions)
- **bcrypt** para el hashing de contraseñas
- Persistencia **en memoria** (repositorios intercambiables por diseño — ver `DECISIONES.md`)

## Estructura del proyecto
```
features/                  Escenarios Gherkin (.feature), uno por historia de usuario
src/
  models/                  Interfaces de dominio (User, Room, Reservation)
  repositories/            Acceso a datos (en memoria)
  services/                Lógica de negocio y errores de dominio
  controllers/             Rutas HTTP (Express)
  middlewares/             Manejo centralizado de errores
  app.ts                   Fábrica de la app (inyección de dependencias)
  index.ts                 Punto de entrada del servidor
tests/
  support/world.ts         World de Cucumber (crea una app aislada por escenario)
  step_definitions/        Implementación de los steps en TypeScript
.github/workflows/main.yml Pipeline de CI
BACKLOG.md                 Historias de usuario y criterios de aceptación
DECISIONES.md              Bitácora de decisiones de diseño (XP)
```

## Requisitos previos
- Node.js 20+
- npm

## Instalación
```bash
npm install
```

## Levantar el servidor
```bash
npm run dev
```
El servidor queda escuchando en `http://localhost:3000`.

Para compilar a JavaScript y correr la versión compilada:
```bash
npm run build
node dist/index.js
```

## Ejecutar la suite de BDD (Cucumber)
```bash
npm run test:e2e
```
<img width="550" height="188" alt="scenarios" src="https://github.com/user-attachments/assets/724828a2-de15-48b9-9b4f-b707a29ba654" />

Esto corre los 7 archivos `.feature` de `features/` contra la API real (usando `supertest`,
sin necesidad de levantar el servidor manualmente).

## Otros comandos
```bash
npm run lint     # ESLint sobre src/ y tests/
npm run build    # Compila TypeScript en modo estricto (falla si hay errores de tipos)
```

## Endpoints principales
<img width="496" height="329" alt="api-endpoints-funcionando" src="https://github.com/user-attachments/assets/57a9f2ee-caed-4a4c-85c2-e8b4167db0e2" />

| Método | Ruta                         | Descripción                              |
|--------|------------------------------|-------------------------------------------|
| POST   | `/auth/register`             | Registra un usuario (contraseña con bcrypt) |
| POST   | `/auth/login`                | Inicia sesión                             |
| POST   | `/rooms`                     | Crea una sala (rol administrador)         |
| GET    | `/rooms`                     | Lista todas las salas                     |
| GET    | `/rooms/availability?date=`  | Salas disponibles en una fecha            |
| GET    | `/rooms/:name/history`       | Historial de reservas de una sala         |
| POST   | `/reservations`              | Reserva una sala                          |
| DELETE | `/reservations/:id`          | Cancela una reserva propia                |

## Decisiones de diseño basadas en XP
Ver `DECISIONES.md` para el detalle de cada decisión (diseño simple/YAGNI, separación de
capas, seguridad, refactorización) y su justificación frente a las prácticas de XP pedidas
en la consigna.

## Sobre el ciclo TDD/BDD (RED → GREEN → REFACTOR)
Este repositorio se entrega con el código ya en estado GREEN (todos los escenarios
pasan). Al subirlo a tu propio control de versiones, se recomienda documentar el proceso
real con commits separados por fase, por ejemplo:
```
test(reserva): agrega escenario de reserva exitosa (RED)
feat(reserva): implementa lógica mínima de reserva (GREEN)
refactor(reserva): extrae validación de disponibilidad a servicio
```
## Integración Continua
<img width="1340" height="636" alt="pipeline-ci-github-actions" src="https://github.com/user-attachments/assets/e005288c-b53c-40f2-b5cf-102b0296de91" />

El pipeline definido en `.github/workflows/main.yml` corre automáticamente en cada push,
ejecutando instalación de dependencias, lint, compilación TypeScript y la suite de BDD.
