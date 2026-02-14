import { httpGet } from './http'
import type { PaginatedResponse } from '../../../contracts/pagination.types'
import type { Pokemon, PokemonListQuery } from '../../../contracts/pokemon.types'
import { serializeQueryKey } from '../utils/queryParams'

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

const CACHE_TTL_MS = 5 * 60 * 1000

const LIST_CACHE = new Map<string, CacheEntry<PaginatedResponse<Pokemon>>>()
const DETAIL_CACHE = new Map<number, CacheEntry<Pokemon>>()

function getValidCache<T>(cache: Map<string | number, CacheEntry<T>>, key: string | number): T | null {
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

function normalizeListQuery(query: PokemonListQuery): PokemonListQuery {
  return {
    page: query.page,
    pageSize: query.pageSize,
    search: query.search?.trim() ? query.search.trim() : undefined,
    sortField: query.sortField,
    sortDirection: query.sortDirection,
  }
}

export async function listPokemons(
  query: PokemonListQuery,
  options?: { forceRefresh?: boolean },
): Promise<PaginatedResponse<Pokemon>> {
  const normalizedQuery = normalizeListQuery(query)
  const normalizedQueryRecord = { ...normalizedQuery }
  const cacheKey = serializeQueryKey(normalizedQueryRecord)

  if (!options?.forceRefresh) {
    const cached = getValidCache(LIST_CACHE, cacheKey)
    if (cached) {
      return cached
    }
  }

  const data = await httpGet<PaginatedResponse<Pokemon>>('/api/pokemons', normalizedQueryRecord)

  LIST_CACHE.set(cacheKey, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })

  return data
}

export async function getPokemonById(
  id: number,
  options?: { forceRefresh?: boolean },
): Promise<Pokemon> {
  if (!options?.forceRefresh) {
    const cached = getValidCache(DETAIL_CACHE, id)
    if (cached) {
      return cached
    }
  }

  const data = await httpGet<Pokemon>(`/api/pokemons/${id}`)

  DETAIL_CACHE.set(id, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS,
  })

  return data
}

export function clearPokemonCache(): void {
  LIST_CACHE.clear()
  DETAIL_CACHE.clear()
}
