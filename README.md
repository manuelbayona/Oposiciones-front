# OpoData — Frontend

Frontend de consulta para procesos selectivos de oposiciones docentes: convocatoria → especialidad → tribunal → listado de aspirantes → detalle del aspirante.

Consume exclusivamente la API REST del [backend](https://github.com/manuelbayona/Oposiciones-backend). No accede directamente a base de datos ni a documentos.

## Stack

- TypeScript + React + Vite
- React Router (rutas navegables por URL)
- TanStack Query (fetching y caché de datos)
- TanStack Table (listado de aspirantes)
- Tailwind CSS
- Vitest + React Testing Library (unitarios y de componentes)
- Playwright (end-to-end)
- ESLint + Prettier

## Puesta en marcha

```bash
npm install
cp .env.example .env   # ajusta VITE_API_BASE_URL a tu backend local
npm run dev
```

La aplicación arranca en `http://localhost:5173`.

## Variables de entorno

| Variable            | Descripción                         | Por defecto |
| ------------------- | ----------------------------------- | ----------- |
| `VITE_API_BASE_URL` | URL base de la API REST del backend | `/api/v1`   |

## Scripts

```bash
npm run dev          # servidor de desarrollo
npm run build        # type-check + build de producción
npm run preview      # sirve el build de producción localmente
npm run lint         # ESLint
npm run format       # Prettier (aplica formato)
npm run format:check # Prettier (solo comprueba)
npm run typecheck    # comprobación de tipos sin emitir
npm run test         # tests unitarios y de componentes (Vitest)
npm run test:watch   # Vitest en modo watch
npm run e2e          # tests end-to-end (Playwright)
```

Cobertura de tests:

```bash
npx vitest run --coverage
```

## Estructura del proyecto

Organización por funcionalidad, no por tipo técnico:

```
src/
  app/                  # router, layout raíz, query client
  features/
    convocations/
    specialities/
    tribunals/
    candidates/
      api/              # llamadas HTTP
      queries/          # hooks de TanStack Query
      components/       # tabla, selectores, tarjetas de detalle
      pages/            # páginas enrutadas
      model/            # tipos de dominio y lógica pura (sort, status)
  shared/
    api/                # cliente HTTP genérico y errores tipados
    components/         # UI reutilizable (estados de carga/error/vacío, paginación...)
    hooks/
    utils/               # formateo de notas, fechas, posiciones
e2e/                     # tests Playwright
```

## Rutas

```
/                                                                     → landing page (presentación + selector de convocatoria/especialidad/tribunal)
/convocations/:convocationId
/convocations/:convocationId/specialities/:specialityId
/convocations/:convocationId/specialities/:specialityId/tribunals/:tribunalId
/candidates/:candidateId
```

El listado de aspirantes mantiene búsqueda, ordenación y página como query params (`?q=&sort=&page=`), de forma que la URL es siempre compartible y recargable. Al abrir un aspirante desde el listado, el contexto de filtros se traslada como query params de `/candidates/:id`, lo que permite volver atrás sin perder el estado y navegar al aspirante anterior/siguiente dentro del mismo listado.

## Contrato con el backend

El listado de aspirantes usa columnas dinámicas: el backend decide qué pruebas/columnas existen para cada convocatoria (`columns` en la respuesta de `/candidates`) y el frontend las renderiza sin asumir una estructura fija. Ver `src/features/candidates/model/candidate.ts` para el contrato de tipos completo. El contrato definitivo de la API se debe acordar con el backend; los endpoints y formas de respuesta actuales son la propuesta inicial del frontend.

## Notas de implementación del MVP

- El frontend nunca decide lógica de negocio (aprobado/suspenso, cálculo de nota final, obtención de plaza): esa información llega ya calculada desde el backend.
- Los valores ausentes se representan como `—`, nunca como `0`.
- La tabla de aspirantes hace scroll horizontal de forma controlada en móvil sin romper el layout de la página.
