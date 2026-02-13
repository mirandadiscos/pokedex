import type { Pokemon } from '../../../../contracts/pokemon.types'

interface PokemonCardProps {
  pokemon: Pokemon
  selected: boolean
  onSelect: (pokemonId: number) => void
}

export function PokemonCard({ pokemon, selected, onSelect }: PokemonCardProps) {
  const typeLabel = pokemon.type2 ? `${pokemon.type1} / ${pokemon.type2}` : pokemon.type1

  return (
    <button
      type="button"
      onClick={() => onSelect(pokemon.id)}
      className={`w-full rounded border bg-white p-2.5 text-left ${selected ? 'border-blue-400' : 'border-slate-200'}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500">#{pokemon.pokedexId}</p>
          <h3 className="text-sm font-semibold leading-tight">{pokemon.name}</h3>
          <p className="mt-0.5 text-xs text-slate-600">{typeLabel}</p>
        </div>

        <img
          src={pokemon.imageUrl ?? ''}
          alt={pokemon.name}
          className="h-24 w-24 object-contain"
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/96x96?text=%3F'
          }}
        />
      </div>
    </button>
  )
}
