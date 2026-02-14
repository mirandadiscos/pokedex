import type { Pokemon } from '../../../../contracts/pokemon.types'
import { PokemonCard } from '../pokemon/PokemonCard'

export type HomeListViewState = 'loading' | 'error' | 'empty' | 'ready'

interface HomeListStateProps {
  viewState: HomeListViewState
  error: string | null
  pokemons: Pokemon[]
  selectedPokemonId: number | null
  onSelectPokemon: (pokemonId: number) => void
  onRetry: () => void
}

function HomeListLoading() {
  return <p className="py-8 text-center text-slate-500">Carregando Pokémon...</p>
}

interface HomeListErrorProps {
  error: string
  onRetry: () => void
}

function HomeListError({ error, onRetry }: HomeListErrorProps) {
  return (
    <div className="space-y-3 py-8 text-center">
      <p className="text-red-600">{error}</p>
      <button type="button" onClick={onRetry} className="rounded bg-slate-900 px-4 py-2 text-sm text-white">
        Tentar novamente
      </button>
    </div>
  )
}

function HomeListEmpty() {
  return <p className="py-8 text-center text-slate-500">Nenhum Pokémon encontrado para esta busca.</p>
}

interface HomeListReadyProps {
  pokemons: Pokemon[]
  selectedPokemonId: number | null
  onSelectPokemon: (pokemonId: number) => void
}

function HomeListReady({ pokemons, selectedPokemonId, onSelectPokemon }: HomeListReadyProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {pokemons.map((pokemon) => (
        <PokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          selected={selectedPokemonId === pokemon.id}
          onSelect={onSelectPokemon}
        />
      ))}
    </div>
  )
}

export function HomeListState({
  viewState,
  error,
  pokemons,
  selectedPokemonId,
  onSelectPokemon,
  onRetry,
}: HomeListStateProps) {
  switch (viewState) {
    case 'loading':
      return <HomeListLoading />
    case 'error':
      return <HomeListError error={error ?? 'Falha ao carregar Pokémon'} onRetry={onRetry} />
    case 'empty':
      return <HomeListEmpty />
    case 'ready':
      return (
        <HomeListReady pokemons={pokemons} selectedPokemonId={selectedPokemonId} onSelectPokemon={onSelectPokemon} />
      )
    default:
      return null
  }
}
