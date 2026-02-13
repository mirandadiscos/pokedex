import type { Pokemon } from '../../../../contracts/pokemon.types'

interface PokemonPreviewProps {
  pokemon: Pokemon | null
  onViewDetails: (pokemonId: number) => void
}

export function PokemonPreview({ pokemon, onViewDetails }: PokemonPreviewProps) {
  if (!pokemon) {
    return <aside className="rounded border border-dashed border-slate-300 bg-white p-3 text-sm text-slate-500">Selecione um Pokémon da lista.</aside>
  }

  return (
    <aside className="rounded border border-slate-200 bg-white p-3">
      <div className="flex items-stretch justify-between gap-3">
        <div className="flex min-h-20 flex-col justify-center">
          <p className="text-xs text-slate-500">#{pokemon.pokedexId}</p>
          <h2 className="text-lg font-bold">{pokemon.name}</h2>
          <p className="text-sm text-slate-600">
            {pokemon.type1}
            {pokemon.type2 ? ` / ${pokemon.type2}` : ''}
          </p>
        </div>

        <img
          src={pokemon.imageUrl ?? ''}
          alt={pokemon.name}
          className="h-20 w-20 object-contain"
          onError={(event) => {
            event.currentTarget.src = 'https://placehold.co/160x160?text=%3F'
          }}
        />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-1.5 text-sm">
        <div className="rounded bg-slate-50 p-1.5">
          <dt className="text-slate-500">HP</dt>
          <dd className="font-semibold">{pokemon.hp}</dd>
        </div>
        <div className="rounded bg-slate-50 p-1.5">
          <dt className="text-slate-500">Ataque</dt>
          <dd className="font-semibold">{pokemon.attack}</dd>
        </div>
        <div className="rounded bg-slate-50 p-1.5">
          <dt className="text-slate-500">Defesa</dt>
          <dd className="font-semibold">{pokemon.defense}</dd>
        </div>
        <div className="rounded bg-slate-50 p-1.5">
          <dt className="text-slate-500">Velocidade</dt>
          <dd className="font-semibold">{pokemon.speed}</dd>
        </div>
      </dl>

      <button type="button" onClick={() => onViewDetails(pokemon.id)} className="mt-3 w-full rounded bg-slate-900 px-3 py-2 text-sm text-white">
        Ver detalhes
      </button>
    </aside>
  )
}
