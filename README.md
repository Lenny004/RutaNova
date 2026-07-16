# RutaNova

Plataforma web para que los repartidores autentiquen su sesión, visualicen rutas en mapa, gestionen entregas con validación por código QR, se comuniquen con gestores y clientes, y consulten su perfil y estadísticas de desempeño.

**Repositorio:** [github.com/Lenny004/RutaNova](https://github.com/Lenny004/RutaNova)  
**Rama de desarrollo:** `develop`

## Stack

- **Frontend:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Leaflet, lucide-react
- **Backend:** Route Handlers de Next.js, Zod, JWT (`jose`), bcryptjs
- **Base de datos:** Prisma ORM + SQLite
- **Utilidades:** qrcode (validación de entrega), Vitest (pruebas)

## Inicio rápido

```bash
npm install
copy .env.example .env
npm run db:migrate
npm run db:seed
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Credenciales demo

- Correo: `carlos.andrade@rutanova.app`
- Contraseña: `RutaNova2024!`

## Documentación

Planes y evaluaciones en la carpeta [`docs/`](./docs/).

## Rama de trabajo

Desarrollo activo en `develop`. `main` se reserva para entregas estables.
