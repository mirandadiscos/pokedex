export type QueryValue = string | number | boolean | null | undefined

export function buildQueryParams(input: Record<string, QueryValue>): URLSearchParams {
  const params = new URLSearchParams()

  Object.entries(input).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return
    }

    params.set(key, String(value))
  })

  return params
}

export function serializeQueryKey(input: Record<string, QueryValue>): string {
  return Object.entries(input)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join('&')
}
