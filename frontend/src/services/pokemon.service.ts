import { httpGet } from './http'
import type { PaginatedResponse } from '../../../contracts/pagination.types'
import type { Pokemon, PokemonListQuery } from '../../../contracts/pokemon.types'
import { serializeQueryKey } from '../utils/queryParams'
import { getValidCache, normalizeListQuery } from './utils/pokemonService.utils'
import type { CacheEntry } from './utils/pokemonService.utils'

const CACHE_TTL_MS = 5 * 60 * 1000

const LIST_CACHE = new Map<string, CacheEntry<PaginatedResponse<Pokemon>>>()
const DETAIL_CACHE = new Map<number, CacheEntry<Pokemon>>()

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
