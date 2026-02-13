import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { HomeHeaderControls } from '../components/home/HomeHeaderControls'
import { PokemonCard } from '../components/pokemon/PokemonCard'
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

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[4fr_1.2fr]">
        <div className="rounded border border-slate-200 bg-white p-4">
          {isLoading ? <p className="py-8 text-center text-slate-500">Carregando Pokémon...</p> : null}

          {!isLoading && error ? (
            <div className="space-y-3 py-8 text-center">
              <p className="text-red-600">{error}</p>
              <button type="button" onClick={() => void refetch(true)} className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
                Tentar novamente
              </button>
            </div>
          ) : null}

          {!isLoading && !error && data.length === 0 ? (
            <p className="py-8 text-center text-slate-500">Nenhum Pokémon encontrado para esta busca.</p>
          ) : null}

          {!isLoading && !error && data.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {data.map((pokemon) => (
                <PokemonCard
                  key={pokemon.id}
                  pokemon={pokemon}
                  selected={selectedPokemon?.id === pokemon.id}
                  onSelect={setSelectedPokemonId}
                />
              ))}
            </div>
          ) : null}

          <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={pagination.page <= 1 || isRefreshing}
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
              disabled={pagination.page >= pagination.totalPages || isRefreshing || pagination.totalPages === 0}
              className="rounded border border-slate-300 px-3 py-2 text-sm disabled:opacity-50"
            >
              Próxima
            </button>
          </div>
        </div>

        <PokemonPreview pokemon={selectedPokemon} onViewDetails={(pokemonId) => navigate(`/pokemon/${pokemonId}`)} />
      </div>
    </section>
  )
}
