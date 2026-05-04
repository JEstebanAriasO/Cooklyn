# Cooklyn

Aplicación web para gestionar tu despensa, registrar restricciones de salud y descubrir recetas según lo que tienes en casa. Incluye favoritos, historial de cocina y sugerencias por porcentaje de coincidencia con el inventario.

## Stack


| Capa     | Tecnología                                                                               |
| -------- | ---------------------------------------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, React Router, TanStack Query, Tailwind CSS, Radix UI, Sonner |
| Backend  | Express 5, Prisma ORM, MySQL                                                             |
| Auth     | JWT (sesión en `localStorage`: token, `user_id`, `user_name`, etc.)                      |


## Estructura del repo

- `src/` — Interfaz: páginas, componentes, contexto (`CooklynProvider`), estilos (`index.css`, tokens en variables CSS).
- `server/index.ts` — API REST bajo `http://localhost:3000/api`.
- `prisma/` — Esquema, migraciones y `seed.ts` (recetas e ingredientes de ejemplo).

## Requisitos

- **Node.js** 20 o superior  
- **MySQL** accesible (local o remoto)

## Configuración

1. **Instalar dependencias**
  ```bash
   npm install
  ```
2. **Variables de entorno** — Crear un archivo `.env` en la raíz del proyecto:
  ```env
   DATABASE_URL="mysql://USUARIO:CONTRASEÑA@localhost:3306/NOMBRE_BD"
   JWT_SECRET="tu_clave_secreta_larga_y_aleatoria"
  ```
   `JWT_SECRET` es opcional en desarrollo (el servidor usa un valor por defecto si falta).
3. **Prisma**
  ```bash
   npx prisma generate
   npx prisma migrate deploy
  ```
   En el primer arranque en máquina nueva, si aún no aplicaste migraciones, puedes usar `npx prisma migrate dev` para crear/actualizar la base según el esquema.
4. **Datos de ejemplo (opcional)**
  ```bash
   npm run seed
  ```

## Cómo ejecutar


| Comando            | Descripción                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `npm run dev:full` | Frontend (Vite) y backend (Express) a la vez                     |
| `npm run dev`      | Solo frontend (puerto por defecto de Vite, normalmente **5173**) |
| `npm run server`   | Solo API en **[http://localhost:3000](http://localhost:3000)**   |


El cliente asume la API en `http://localhost:3000`. Si cambias el puerto del servidor, actualiza las URLs `fetch` en el frontend o usa un proxy en Vite.

## Scripts útiles

- `npm run build` — `tsc` + compilación de producción con Vite  
- `npm run preview` — Sirve el build localmente  
- `npm run lint` — ESLint  
- `npm run seed` — Pobla ingredientes y recetas vía `dotenv` + `prisma/seed.ts`

## Rutas de la aplicación


| Ruta                                  | Descripción                                                        |
| ------------------------------------- | ------------------------------------------------------------------ |
| `/`                                   | Inicio                                                             |
| `/login`, `/registro`                 | Autenticación                                                      |
| `/inventario`                         | Inventario, filtros de salud y recetas sugeridas (requiere sesión) |
| `/recetas`, `/recetas/:id`            | Catálogo y detalle de receta                                       |
| `/favoritos`, `/historial`, `/perfil` | Áreas de usuario (protegidas)                                      |


## API (resumen)

Base: `http://localhost:3000/api`

**Autenticación**

- `POST /auth/register` — Registro (`email`, `password`, `name`, opcional `restrictionIds`)
- `POST /auth/login` — Login; responde `token` y `user`

**Inventario**

- `GET /inventory/:userId`  
- `POST /inventory` — `{ userId, ingredientId, quantity? }`  
- `DELETE /inventory/:id`

**Recetas**

- `GET /recipes` — Listado con ingredientes  
- `GET /recipes/:id`  
- `GET /recipes/match/:userId` — Recetas donde tienes **todos** los ingredientes  
- `GET /recipes/:recipeId/missing-ingredients/:userId`  
- `POST /recipes/cook` — `{ userId, recipeId }` — Registra cocina y descuenta ingredientes del inventario

**Favoritos e historial**

- `POST /favorites/toggle` — `{ userId, recipeId }`  
- `GET /favorites/:userId`  
- `GET /history/:userId`

**Catálogo**

- `GET /restrictions`  
- `GET /ingredients/search?q=`  
- `GET /ingredients`  
- `POST /ingredients` — Crear o actualizar ingrediente por nombre

## Licencia

Proyecto privado (`private` en `package.json`).