import type { Pokemon } from '../../../../contracts/pokemon.types'

interface PokemonStatsGridProps {
  pokemon: Pokemon
}

const STAT_CARD_CLASS = 'rounded bg-slate-50 p-2'
const STAT_LABEL_CLASS = 'text-sm text-slate-500'
const STAT_VALUE_CLASS = 'text-lg font-semibold text-slate-900'

interface StatItemProps {
  label: string
  value: string | number
}

function StatItem({ label, value }: StatItemProps) {
  return (
    <div className={STAT_CARD_CLASS}>
      <dt className={STAT_LABEL_CLASS}>{label}</dt>
      <dd className={STAT_VALUE_CLASS}>{value}</dd>
    </div>
  )
}

export function PokemonStatsGrid({ pokemon }: PokemonStatsGridProps) {
  const stats = [
    { label: 'HP', value: pokemon.hp },
    { label: 'Ataque', value: pokemon.attack },
    { label: 'Defesa', value: pokemon.defense },
    { label: 'Ataque Especial', value: pokemon.spAttack },
    { label: 'Defesa Especial', value: pokemon.spDefense },
    { label: 'Velocidade', value: pokemon.speed },
    { label: 'Total', value: pokemon.total },
    { label: 'Geração', value: pokemon.generation },
    { label: 'Lendário', value: pokemon.legendary ? 'Sim' : 'Não' },
  ]

  return (
    <dl className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-3">
      {stats.map((stat) => (
        <StatItem key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </dl>
  )
}
