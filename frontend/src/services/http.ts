import { buildQueryParams, type QueryValue } from '../utils/queryParams'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001'

type QueryInput = Record<string, QueryValue>

interface HttpErrorPayload {
  message?: string
  code?: string
  requestId?: string
  details?: unknown
}

export class HttpRequestError extends Error {
  status: number
  code?: string
  requestId?: string
  details?: unknown

  constructor(status: number, message: string, options?: { code?: string; requestId?: string; details?: unknown }) {
    super(message)
    this.name = 'HttpRequestError'
    this.status = status
    this.code = options?.code
    this.requestId = options?.requestId
    this.details = options?.details
  }
}

function buildUrl(path: string, query?: QueryInput): string {
  const url = new URL(path, API_BASE_URL)

  if (query) {
    url.search = buildQueryParams(query).toString()
  }

  return url.toString()
}

export async function httpGet<T>(path: string, query?: QueryInput): Promise<T> {
  const response = await fetch(buildUrl(path, query), {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    let message = `Requisicao falhou com status ${response.status}`
    let code: string | undefined
    let requestId: string | undefined
    let details: unknown

    try {
      const payload = (await response.json()) as HttpErrorPayload
      if (payload.message) {
        message = payload.message
      }
      code = payload.code
      requestId = payload.requestId
      details = payload.details
    } catch {}

    throw new HttpRequestError(response.status, message, { code, requestId, details })
  }

  return (await response.json()) as T
}
