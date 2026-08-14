import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorMessage, StateMessage } from '../../../shared/components/StateMessage'
import { SpecialitySelector } from '../../specialities/components/SpecialitySelector'
import { TribunalSelector } from '../../tribunals/components/TribunalSelector'
import { ConvocationSelector } from './ConvocationSelector'
import { useConvocationYears } from '../queries'

export function ConvocationPicker() {
  const [convocationYear, setConvocationYear] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [tribunalNumber, setTribunalNumber] = useState('')
  const navigate = useNavigate()
  const { data, isLoading, isError, refetch } = useConvocationYears()

  function handleConvocationChange(nextConvocationYear: string) {
    setConvocationYear(nextConvocationYear)
    setSpecialty('')
    setTribunalNumber('')
  }

  function handleSpecialtyChange(nextSpecialty: string) {
    setSpecialty(nextSpecialty)
    setTribunalNumber('')
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!convocationYear || !specialty || !tribunalNumber) {
      return
    }
    navigate(
      `/convocations/${encodeURIComponent(convocationYear)}/specialities/${encodeURIComponent(specialty)}/tribunals/${encodeURIComponent(tribunalNumber)}`,
    )
  }

  const isEmpty = !isLoading && !isError && (data?.length ?? 0) === 0
  const canSubmit = Boolean(convocationYear && specialty && tribunalNumber)

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
            <ConvocationSelector value={convocationYear} onChange={handleConvocationChange} />
            <SpecialitySelector
              convocationYear={convocationYear || undefined}
              value={specialty}
              onChange={handleSpecialtyChange}
            />
            <TribunalSelector
              convocationYear={convocationYear || undefined}
              specialty={specialty || undefined}
              value={tribunalNumber}
              onChange={setTribunalNumber}
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
