import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { SpecialitySelector } from '../../specialities/components/SpecialitySelector'
import { TribunalSelector } from '../../tribunals/components/TribunalSelector'
import { ConvocationSelector } from './ConvocationSelector'
import { useConvocations } from '../queries'

export function ConvocationPicker() {
  const [convocationId, setConvocationId] = useState('')
  const [specialityId, setSpecialityId] = useState('')
  const [tribunalId, setTribunalId] = useState('')
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useConvocations()

  function handleConvocationChange(nextConvocationId: string) {
    setConvocationId(nextConvocationId)
    setSpecialityId('')
    setTribunalId('')
  }

  function handleSpecialityChange(nextSpecialityId: string) {
    setSpecialityId(nextSpecialityId)
    setTribunalId('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!convocationId || !specialityId || !tribunalId) {
      return
    }
    navigate(`/convocations/${convocationId}/specialities/${specialityId}/tribunals/${tribunalId}`)
  }

  const isEmpty = !isLoading && !isError && (data?.length ?? 0) === 0
  const canSubmit = Boolean(convocationId && specialityId && tribunalId)

  return (
    <section id="consultar" className="scroll-mt-6 rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-slate-900">Consulta una convocatoria</h2>

      {isError && (
        <div className="mt-4">
          <ErrorMessage onRetry={() => refetch()} />
        </div>
      )}

      {isEmpty && (
        <div className="mt-4">
          <StateMessage title="No hay convocatorias disponibles todavía." />
        </div>
      )}

      {!isError && !isEmpty && (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <ConvocationSelector value={convocationId} onChange={handleConvocationChange} />
            <SpecialitySelector
              convocationId={convocationId || undefined}
              value={specialityId}
              onChange={handleSpecialityChange}
            />
            <TribunalSelector
              convocationId={convocationId || undefined}
              specialityId={specialityId || undefined}
              value={tribunalId}
              onChange={setTribunalId}
            />
          </div>
          <button
            type="submit"
            disabled={!canSubmit}
            className="self-start rounded-md bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Ver aspirantes
          </button>
        </form>
      )}
    </section>
  )
}
