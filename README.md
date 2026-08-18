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
npm run cms          # servidor local del editor de contenido (ver más abajo)
```

Cobertura de tests:

```bash
npx vitest run --coverage
```

## Edición del contenido de la portada

Los textos de la portada (`Hero`, `IntroSection`, `ValueProps`, `FutureRoadmap`,
`EvolutionPreview`, `DataDisclaimer`) no están escritos a mano en los componentes:
cada uno lee de un fichero JSON en `src/content/homepage/`. Esto permite editarlos
sin tocar código, con un editor visual ([Decap CMS](https://decapcms.org)) montado
en `/admin`.

**Edición local:**

```bash
npm run dev   # terminal 1 — servidor de la app
npm run cms   # terminal 2 — proxy local de Decap CMS (puerto 8081)
```

Abre `http://localhost:5173/admin/index.html` (en desarrollo hace falta el
`index.html` explícito; en producción `/admin/` resuelve solo, como se
comprobó con `npm run build && npm run preview`). Los cambios que guardes se
escriben directamente en los ficheros de `src/content/homepage/` como commits
locales — no hace falta ninguna cuenta ni token mientras trabajes en local.

**Desplegado:** el `backend:` de `public/admin/config.yml` está configurado
para GitHub (`manuelbayona/oposiciones-front`, rama `main`). Para editar desde
el sitio ya desplegado hace falta dar de alta una GitHub OAuth App y un pequeño
proxy de autenticación (Decap lo documenta en
[decapcms.org/docs/github-backend](https://decapcms.org/docs/github-backend/));
hasta entonces, `/admin` en producción no permitirá iniciar sesión.

Para añadir un campo nuevo a una sección existente: edítalo en el JSON
correspondiente, en el componente que lo consume, y en
`public/admin/config.yml` (mismo nombre de campo en los tres sitios).

## Estructura del proyecto

Organización por funcionalidad, no por tipo técnico:

```
src/
  app/                  # router, layout raíz, query client
  content/
    homepage/           # copy de la portada editable vía /admin (Decap CMS)
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
/candidates/:id
/interinos                                                                     → listado definitivo de interinos, paginado y filtrable por bloque/especialidad
```

El listado de aspirantes y el listado de interinos mantienen sus filtros y página como query params, de forma que la URL es siempre compartible y recargable. Al abrir un aspirante desde cualquiera de los dos listados, el contexto (filtros de convocatoria/especialidad/tribunal, o de bloque/especialidad de interinos) se traslada como query params de `/candidates/:id`, lo que permite volver atrás sin perder el estado. La navegación al aspirante anterior/siguiente solo está disponible viniendo del listado de aspirantes (que se carga completo); el listado de interinos pagina del lado del servidor sobre miles de filas reales, por lo que no ofrece esa navegación — ver "Limitaciones conocidas".

## Contrato con el backend

El frontend consume el contrato real y actual del backend, sin campos ni capacidades especulativas:

- `GET /api/v1/candidates?name=&specialty=&tribunalNumber=&convocationYear=` → `{id, maskedIdentifier, fullName}[]`, sin paginación ni ordenación.
- `GET /api/v1/candidates/{id}/results` / `/participations` / `/interinos` → detalle del aspirante.
- `GET /api/v1/interinos?block=&specialtyCode=&page=&size=` → listado paginado por el servidor.
- `GET /api/v1/interinos/specialties` → código → nombre de especialidad, para etiquetar `accreditedSpecialtyCodes`.

El aspirante se identifica por el `id` numérico del backend (`Candidate.id`), no por su `maskedIdentifier`: un mismo `maskedIdentifier` puede corresponder a varias personas distintas (ver ADR-009 en `Oposiciones-backend`), así que ya no es una clave de ruta válida por sí sola. `maskedIdentifier` y `fullName` se siguen mostrando en el detalle, pero solo `id` navega. Ver `src/features/candidates/model/candidate.ts` e `src/features/interinos/model/interinos.ts` para el contrato de tipos completo.

## Limitaciones conocidas

- El listado de aspirantes (`/candidates`) no admite paginación ni ordenación en el backend: se muestra la lista completa filtrada, sin notas por fila (ese endpoint no las expone).
- El listado de interinos pagina del lado del servidor sobre miles de entradas reales; por eso, a diferencia del listado de aspirantes, no ofrece navegación "aspirante anterior/siguiente" desde el detalle (requeriría cargar el listado completo).

## Notas de implementación del MVP

- El frontend nunca decide lógica de negocio (aprobado/suspenso, cálculo de nota final, obtención de plaza): esa información llega ya calculada desde el backend.
- Los valores ausentes se representan como `—`, nunca como `0`.
- La tabla de aspirantes hace scroll horizontal de forma controlada en móvil sin romper el layout de la página.
