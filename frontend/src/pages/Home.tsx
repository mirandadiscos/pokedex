import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HomeHeaderControls } from '../components/home/HomeHeaderControls'
import { HomeListState } from '../components/home/HomeListState'
import type { HomeListViewState } from '../components/home/HomeListState'
import { PokemonPreview } from '../components/pokemon/PokemonPreview'
import { usePokemons } from '../hooks/usePokemons'
import { useHeaderSlot } from '../layouts/HeaderSlotContext'

export function Home() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const setHeaderSlot = useHeaderSlot()
  const initialSearch = searchParams.get('search')?.trim() ?? ''

  const {
    data,
    pagination,
    query,
    isLoading,
    isRefreshing,
    error,
    setSearch,
    setSort,
    setPageSize,
    goToPreviousPage,
    goToNextPage,
    refetch,
  } = usePokemons({
    page: 1,
    pageSize: 9,
    search: initialSearch || undefined,
    sortField: 'pokedexId',
    sortDirection: 'ASC',
  })

  const [searchInput, setSearchInput] = useState(initialSearch)
  const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null)
  const [showFiltersMenu, setShowFiltersMenu] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput), 300)
    return () => clearTimeout(timeout)
  }, [searchInput, setSearch])

  const selectedPokemon = useMemo(() => {
    if (data.length === 0) return null
    return data.find((pokemon) => pokemon.id === selectedPokemonId) ?? data[0]
  }, [data, selectedPokemonId])

  const headerControls = useMemo(() => {
    return (
      <HomeHeaderControls
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        query={query}
        showFiltersMenu={showFiltersMenu}
        onToggleFilters={() => setShowFiltersMenu((prev) => !prev)}
        onSortChange={setSort}
        onPageSizeChange={setPageSize}
      />
    )
  }, [query, searchInput, setPageSize, setSort, showFiltersMenu])

  useEffect(() => {
    setHeaderSlot(headerControls)
    return () => setHeaderSlot(null)
  }, [headerControls, setHeaderSlot])

  let viewState: HomeListViewState
  if (isLoading) {
    viewState = 'loading'
  } else if (error) {
    viewState = 'error'
  } else if (data.length === 0) {
    viewState = 'empty'
  } else {
    viewState = 'ready'
  }

  const canGoToPreviousPage = pagination.page > 1 && isRefreshing === false
  const canGoToNextPage =
    pagination.page < pagination.totalPages && pagination.totalPages > 0 && isRefreshing === false

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[4fr_1.2fr]">
        <div className="rounded border border-slate-200 bg-white p-4">
          <HomeListState
            viewState={viewState}
            error={error}
            pokemons={data}
            selectedPokemonId={selectedPokemon?.id ?? null}
            onSelectPokemon={setSelectedPokemonId}
            onRetry={() => void refetch(true)}
          />

          {viewState === 'ready' ? (
            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={goToPreviousPage}
                disabled={!canGoToPreviousPage}
                className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                Anterior
              </button>

              <p className="text-sm text-slate-600">
                Página {pagination.page} de {Math.max(1, pagination.totalPages)}
              </p>

              <button
                type="button"
                onClick={goToNextPage}
                disabled={!canGoToNextPage}
                className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          ) : null}
        </div>

        <PokemonPreview pokemon={selectedPokemon} onViewDetails={(pokemonId) => navigate(`/pokemon/${pokemonId}`)} />
      </div>
    </section>
  )
}
