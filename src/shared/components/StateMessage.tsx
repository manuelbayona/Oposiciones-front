import type { ReactNode } from 'react'

interface StateMessageProps {
  title: string
  description?: string
  action?: ReactNode
}

export function StateMessage({ title, description, action }: StateMessageProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
      <p className="text-base font-medium text-slate-700">{title}</p>
      {description && <p className="text-sm text-slate-500">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorMessage({ onRetry }: { onRetry?: () => void }) {
  return (
    <StateMessage
      title="No hemos podido cargar los datos."
      description="Comprueba tu conexión e inténtalo de nuevo."
      action={
        onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            Reintentar
          </button>
        )
      }
    />
  )
}
