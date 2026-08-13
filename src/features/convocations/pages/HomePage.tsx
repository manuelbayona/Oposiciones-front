import { Navigate } from 'react-router-dom'
import { useConvocations } from '../queries'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { SelectionBar } from '../../candidates/components/SelectionBar'

export function HomePage() {
  const { data, isLoading, isError, refetch } = useConvocations()

  if (isLoading) {
    return <SelectionBar />
  }

  if (isError) {
    return <ErrorMessage onRetry={() => refetch()} />
  }

  if (!data || data.length === 0) {
    return <StateMessage title="No hay convocatorias disponibles todavía." />
  }

  const latestConvocation = [...data].sort((a, b) => b.year - a.year)[0]

  return <Navigate to={`/convocations/${latestConvocation.id}`} replace />
}
