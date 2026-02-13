import { useCallback, useEffect, useMemo, useState } from 'react'
import { listPokemons } from '../services/pokemon.service'
import type { PaginatedResponse, PaginationMeta } from '../../../contracts/pagination.types'
import type { Pokemon, PokemonListQuery, PokemonSortField } from '../../../contracts/pokemon.types'

const DEFAULT_QUERY: PokemonListQuery = {
  page: 1,
  pageSize: 9,
  sortField: 'pokedexId',
  sortDirection: 'ASC',
}

const EMPTY_RESPONSE: PaginatedResponse<Pokemon> = {
  data: [],
  pagination: {
    page: 1,
    pageSize: 9,
    totalItems: 0,
    totalPages: 0,
  },
}

interface UsePokemonsResult {
  data: Pokemon[]
  pagination: PaginationMeta
  query: PokemonListQuery
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  setPage: (page: number) => void
  setPageSize: (pageSize: number) => void
  setSearch: (search: string) => void
  setSort: (sortField: PokemonSortField, sortDirection: 'ASC' | 'DESC') => void
  goToPreviousPage: () => void
  goToNextPage: () => void
  refetch: (forceRefresh?: boolean) => Promise<void>
}

export function usePokemons(initialQuery?: Partial<PokemonListQuery>): UsePokemonsResult {
  const [query, setQuery] = useState<PokemonListQuery>({
    ...DEFAULT_QUERY,
    ...initialQuery,
  })
  const [response, setResponse] = useState<PaginatedResponse<Pokemon>>(EMPTY_RESPONSE)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPokemons = useCallback(
    async (forceRefresh = false): Promise<void> => {
      setError(null)
      setIsRefreshing(true)

      try {
        const nextResponse = await listPokemons(query, { forceRefresh })
        setResponse(nextResponse)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao carregar Pokémon'
        setError(message)
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [query],
  )

  useEffect(() => {
    fetchPokemons()
  }, [fetchPokemons])

  const canGoToNext = useMemo(() => {
    return response.pagination.page < response.pagination.totalPages
  }, [response.pagination.page, response.pagination.totalPages])

  const setPage = useCallback((page: number) => {
    setQuery((prev) => ({ ...prev, page: Math.max(1, page) }))
  }, [])

  const setPageSize = useCallback((pageSize: number) => {
    setQuery((prev) => ({ ...prev, pageSize: Math.max(1, pageSize), page: 1 }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      search: search.trim() ? search : undefined,
    }))
  }, [])

  const setSort = useCallback((sortField: PokemonSortField, sortDirection: 'ASC' | 'DESC') => {
    setQuery((prev) => ({
      ...prev,
      page: 1,
      sortField,
      sortDirection,
    }))
  }, [])

  const goToPreviousPage = useCallback(() => {
    setPage(query.page - 1)
  }, [query.page, setPage])

  const goToNextPage = useCallback(() => {
    if (canGoToNext) {
      setPage(query.page + 1)
    }
  }, [canGoToNext, query.page, setPage])

  const refetch = useCallback(
    async (forceRefresh = false) => {
      await fetchPokemons(forceRefresh)
    },
    [fetchPokemons],
  )

  return {
    data: response.data,
    pagination: response.pagination,
    query,
    isLoading,
    isRefreshing,
    error,
    setPage,
    setPageSize,
    setSearch,
    setSort,
    goToPreviousPage,
    goToNextPage,
    refetch,
  }
}
