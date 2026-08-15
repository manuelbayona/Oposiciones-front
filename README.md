# OpoData — Frontend

Frontend de consulta para procesos selectivos de oposiciones docentes: convocatoria → especialidad → tribunal → listado de aspirantes → detalle del aspirante.

Consume exclusivamente la API REST del [backend](https://github.com/manuelbayona/Oposiciones-backend). No accede directamente a base de datos ni a documentos.

## Stack

- TypeScript + React + Vite
- React Router (rutas navegables por URL)
- TanStack Query (fetching y caché de datos)
- TanStack Table (listado de interinos)
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
      api/              # llamadas HTTP (incluye /candidates/{id}/interinos)
      queries/          # hooks de TanStack Query
      components/       # tabla, selectores, secciones de detalle
      pages/            # páginas enrutadas
      model/            # tipos de dominio
    interinos/
      api/              # llamadas HTTP (/interinos, /interinos/specialties)
      queries/          # hooks de TanStack Query
      components/       # tabla paginada, filtros, sección de detalle del aspirante
      pages/            # listado de interinos
      model/            # tipos de dominio
      utils/            # formateo específico (bloque)
  shared/
    api/                # cliente HTTP genérico y errores tipados
    components/         # UI reutilizable (estados de carga/error/vacío, paginación...)
    hooks/
    utils/               # formateo de notas, fechas, posiciones
e2e/                     # tests Playwright
```

## Rutas

```
/                                                                              → landing page (presentación + selector de convocatoria/especialidad/tribunal)
/convocations/:convocationYear
/convocations/:convocationYear/specialities/:specialty
/convocations/:convocationYear/specialities/:specialty/tribunals/:tribunalNumber
/candidates/:maskedIdentifier
/interinos                                                                     → listado definitivo de interinos, paginado y filtrable por bloque/especialidad
```

El listado de aspirantes y el listado de interinos mantienen sus filtros y página como query params, de forma que la URL es siempre compartible y recargable. Al abrir un aspirante desde cualquiera de los dos listados, el contexto (filtros de convocatoria/especialidad/tribunal, o de bloque/especialidad de interinos) se traslada como query params de `/candidates/:maskedIdentifier`, lo que permite volver atrás sin perder el estado. La navegación al aspirante anterior/siguiente solo está disponible viniendo del listado de aspirantes (que se carga completo); el listado de interinos pagina del lado del servidor sobre miles de filas reales, por lo que no ofrece esa navegación — ver "Limitaciones conocidas".

## Contrato con el backend

El frontend consume el contrato real y actual del backend, sin campos ni capacidades especulativas:

- `GET /api/v1/candidates?name=&specialty=&tribunalNumber=&convocationYear=` → `{maskedIdentifier, fullName}[]`, sin paginación ni ordenación.
- `GET /api/v1/candidates/{maskedIdentifier}/results` / `/participations` / `/interinos` → detalle del aspirante.
- `GET /api/v1/interinos?block=&specialtyCode=&page=&size=` → listado paginado por el servidor.
- `GET /api/v1/interinos/specialties` → código → nombre de especialidad, para etiquetar `accreditedSpecialtyCodes`.

El aspirante nunca se identifica por un id numérico: siempre por su `maskedIdentifier` (p. ej. `***1234**`). Ver `src/features/candidates/model/candidate.ts` e `src/features/interinos/model/interinos.ts` para el contrato de tipos completo.

## Limitaciones conocidas

- El listado de aspirantes (`/candidates`) no admite paginación ni ordenación en el backend: se muestra la lista completa filtrada, sin notas por fila (ese endpoint no las expone).
- El listado de interinos pagina del lado del servidor sobre miles de entradas reales; por eso, a diferencia del listado de aspirantes, no ofrece navegación "aspirante anterior/siguiente" desde el detalle (requeriría cargar el listado completo).

## Notas de implementación del MVP

- El frontend nunca decide lógica de negocio (aprobado/suspenso, cálculo de nota final, obtención de plaza): esa información llega ya calculada desde el backend.
- Los valores ausentes se representan como `—`, nunca como `0`.
- La tabla de aspirantes hace scroll horizontal de forma controlada en móvil sin romper el layout de la página.
