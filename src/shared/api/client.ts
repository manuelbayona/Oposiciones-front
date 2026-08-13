import { ApiError, NotFoundError } from './errors'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api/v1'

export type QueryParams = Record<string, string | number | boolean | undefined>

function buildUrl(path: string, params?: QueryParams): string {
  const url = new URL(`${API_BASE_URL}${path}`, window.location.origin)
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    }
  }
  return url.toString()
}

export async function apiGet<T>(path: string, params?: QueryParams): Promise<T> {
  let response: Response
  try {
    response = await fetch(buildUrl(path, params), {
      headers: { Accept: 'application/json' },
    })
  } catch {
    throw new ApiError('No se ha podido conectar con el servidor.', 0)
  }

  if (response.status === 404) {
    throw new NotFoundError()
  }

  if (!response.ok) {
    throw new ApiError('Ha ocurrido un error inesperado.', response.status)
  }

  return (await response.json()) as T
}
