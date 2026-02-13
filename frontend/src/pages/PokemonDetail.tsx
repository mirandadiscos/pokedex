import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { DetailHeaderSearch } from '../components/detail/DetailHeaderSearch'
import { PokemonStatsGrid } from '../components/detail/PokemonStatsGrid'
import { usePokemonDetail } from '../hooks/usePokemonDetail'
import { useHeaderSlot } from '../layouts/HeaderSlotContext'

export function PokemonDetail() {
  const navigate = useNavigate()
  const setHeaderSlot = useHeaderSlot()
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const { data: pokemon, isLoading, error, refetch } = usePokemonDetail(Number.isFinite(numericId) ? numericId : undefined)
  const [searchInput, setSearchInput] = useState('')

  const headerControls = useMemo(() => {
    return (
      <DetailHeaderSearch
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        onSubmit={(value) => {
          const term = value.trim()
          navigate(term ? `/?search=${encodeURIComponent(term)}` : '/')
        }}
      />
    )
  }, [navigate, searchInput])

  useEffect(() => {
    setHeaderSlot(headerControls)
    return () => setHeaderSlot(null)
  }, [headerControls, setHeaderSlot])

  if (isLoading) {
    return <p className="py-8 text-center text-slate-500">Carregando detalhes do Pokémon...</p>
  }

  if (error) {
    return (
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-red-600">{error}</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void refetch(true)}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          >
            Tentar novamente
          </button>
          <Link to="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
            Voltar para lista
          </Link>
        </div>
      </section>
    )
  }

  if (!pokemon) {
    return (
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-slate-600">Pokémon não encontrado.</p>
        <Link to="/" className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">
          Voltar para lista
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-2">
      <Link to="/" className="inline-flex rounded border border-slate-300 px-3 py-1.5 text-sm text-slate-700">
        Voltar
      </Link>

      <article className="rounded border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">#{pokemon.pokedexId}</p>
            <h2 className="text-2xl font-bold text-slate-900">{pokemon.name}</h2>
            <p className="text-sm text-slate-600">
              {pokemon.type1}
              {pokemon.type2 ? ` / ${pokemon.type2}` : ''}
            </p>
          </div>

          <img
            src={pokemon.imageUrl ?? ''}
            alt={pokemon.name}
            className="h-40 w-40 object-contain"
            onError={(event) => {
              event.currentTarget.src = 'https://placehold.co/192x192?text=%3F'
            }}
          />
        </div>

        <PokemonStatsGrid pokemon={pokemon} />
      </article>
    </section>
  )
}
