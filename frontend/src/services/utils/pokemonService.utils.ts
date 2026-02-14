import type { PokemonListQuery } from '../../../../contracts/pokemon.types'

export interface CacheEntry<T> {
  data: T
  expiresAt: number
}

export function getValidCache<T>(cache: Map<string | number, CacheEntry<T>>, key: string | number): T | null {
  const cacheEntry = cache.get(key)

  if (!cacheEntry) {
    return null
  }

  if (cacheEntry.expiresAt <= Date.now()) {
    cache.delete(key)
    return null
  }

  return cacheEntry.data
}

export function normalizeListQuery(query: PokemonListQuery): PokemonListQuery {
  return {
    page: query.page,
    pageSize: query.pageSize,
    search: query.search?.trim() ? query.search.trim() : undefined,
    sortField: query.sortField,
    sortDirection: query.sortDirection,
  }
}
