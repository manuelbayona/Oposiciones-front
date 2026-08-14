import { Link, Outlet } from 'react-router-dom'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-3 sm:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
            OpoData
          </Link>
          <span className="text-sm text-slate-500">Entiende tus oposiciones, no solo tu nota.</span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-sm text-slate-500 sm:px-6">
          <p className="font-semibold text-slate-700">OpoData</p>
          <p>Información organizada para entender mejor los procesos selectivos docentes.</p>
          <p>
            Los datos oficiales publicados por la administración prevalecen siempre sobre la
            información mostrada en esta plataforma.
          </p>
        </div>
      </footer>
    </div>
  )
}
