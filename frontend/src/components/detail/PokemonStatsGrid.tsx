import type { Pokemon } from '../../../../contracts/pokemon.types'

interface PokemonStatsGridProps {
  pokemon: Pokemon
}

const statCardClass = 'rounded bg-slate-50 p-2'
const statLabelClass = 'text-sm text-slate-500'
const statValueClass = 'text-lg font-semibold text-slate-900'

export function PokemonStatsGrid({ pokemon }: PokemonStatsGridProps) {
  return (
    <dl className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
      <div className={statCardClass}>
        <dt className={statLabelClass}>HP</dt>
        <dd className={statValueClass}>{pokemon.hp}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Ataque</dt>
        <dd className={statValueClass}>{pokemon.attack}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Defesa</dt>
        <dd className={statValueClass}>{pokemon.defense}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Ataque Especial</dt>
        <dd className={statValueClass}>{pokemon.spAttack}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Defesa Especial</dt>
        <dd className={statValueClass}>{pokemon.spDefense}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Velocidade</dt>
        <dd className={statValueClass}>{pokemon.speed}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Total</dt>
        <dd className={statValueClass}>{pokemon.total}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Geração</dt>
        <dd className={statValueClass}>{pokemon.generation}</dd>
      </div>
      <div className={statCardClass}>
        <dt className={statLabelClass}>Lendário</dt>
        <dd className={statValueClass}>{pokemon.legendary ? 'Sim' : 'Não'}</dd>
      </div>
    </dl>
  )
}
