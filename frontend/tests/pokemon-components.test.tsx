import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { PokemonCard } from '../src/components/pokemon/PokemonCard'
import { PokemonPreview } from '../src/components/pokemon/PokemonPreview'
import type { Pokemon } from '../../contracts/pokemon.types'

const PIKACHU: Pokemon = {
  id: 25,
  pokedexId: 25,
  name: 'Pikachu',
  type1: 'Electric',
  type2: null,
  total: 320,
  hp: 35,
  attack: 55,
  defense: 40,
  spAttack: 50,
  spDefense: 50,
  speed: 90,
  generation: 1,
  legendary: false,
  imageUrl: 'https://example.com/pikachu.png',
}

describe('pokemon components', () => {
  it('PokemonCard renderiza dados principais e estado selecionado', () => {
    render(<PokemonCard pokemon={PIKACHU} selected onSelect={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Pikachu' })).toBeInTheDocument()
    expect(screen.getByText('#25')).toBeInTheDocument()
    expect(screen.getByText('Electric')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveClass('border-blue-400')
  })

  it('PokemonPreview sem seleção mostra mensagem de orientação', () => {
    render(<PokemonPreview pokemon={null} onViewDetails={() => {}} />)

    expect(screen.getByText('Selecione um Pokémon da lista.')).toBeInTheDocument()
  })

  it('PokemonPreview com pokemon mostra nome e stats básicas', () => {
    render(<PokemonPreview pokemon={PIKACHU} onViewDetails={() => {}} />)

    expect(screen.getByText('Pikachu')).toBeInTheDocument()
    expect(screen.getByText('HP')).toBeInTheDocument()
    expect(screen.getByText('Ataque')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver detalhes' })).toBeInTheDocument()
  })
})
