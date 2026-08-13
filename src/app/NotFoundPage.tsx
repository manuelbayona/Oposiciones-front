import { Link } from 'react-router-dom'
import { StateMessage } from '../shared/components/StateMessage'

export function NotFoundPage() {
  return (
    <StateMessage
      title="Página no encontrada."
      action={
        <Link to="/" className="mt-2 text-sm font-medium text-slate-700 hover:text-slate-900">
          Volver al inicio
        </Link>
      }
    />
  )
}
