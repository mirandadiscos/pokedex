import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PokemonStatsGrid } from '../src/components/detail/PokemonStatsGrid'
import type { Pokemon } from '../../contracts/pokemon.types'

const MEWTWO: Pokemon = {
  id: 150,
  pokedexId: 150,
  name: 'Mewtwo',
  type1: 'Psychic',
  type2: null,
  total: 680,
  hp: 106,
  attack: 110,
  defense: 90,
  spAttack: 154,
  spDefense: 90,
  speed: 130,
  generation: 1,
  legendary: true,
  imageUrl: null,
}

describe('PokemonStatsGrid', () => {
  it('renderiza os campos de status esperados', () => {
    render(<PokemonStatsGrid pokemon={MEWTWO} />)

    expect(screen.getByText('Ataque Especial')).toBeInTheDocument()
    expect(screen.getByText('Defesa Especial')).toBeInTheDocument()
    expect(screen.getByText('Geração')).toBeInTheDocument()
    expect(screen.getByText('Lendário')).toBeInTheDocument()
    expect(screen.getByText('Sim')).toBeInTheDocument()
  })
})
