import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { HomeHeaderControls } from '../src/components/home/HomeHeaderControls'
import type { PokemonListQuery } from '../../contracts/pokemon.types'

const BASE_QUERY: PokemonListQuery = {
  page: 1,
  pageSize: 9,
  sortField: 'pokedexId',
  sortDirection: 'ASC',
}

describe('HomeHeaderControls', () => {
  it('renderiza busca e filtros', () => {
    render(
      <HomeHeaderControls
        searchInput="pik"
        onSearchInputChange={vi.fn()}
        query={BASE_QUERY}
        showFiltersMenu
        onToggleFilters={vi.fn()}
        onSortChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    )

    expect(screen.getByPlaceholderText('Buscar Pokémon...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Filtros ▼' })).toBeInTheDocument()
    expect(screen.getByText('Ordenar por')).toBeInTheDocument()
    expect(screen.getByText('Itens por página')).toBeInTheDocument()
  })

  it('dispara callbacks de ordenação e paginação', () => {
    const onSortChange = vi.fn()
    const onPageSizeChange = vi.fn()

    render(
      <HomeHeaderControls
        searchInput=""
        onSearchInputChange={vi.fn()}
        query={BASE_QUERY}
        showFiltersMenu
        onToggleFilters={vi.fn()}
        onSortChange={onSortChange}
        onPageSizeChange={onPageSizeChange}
      />,
    )

    fireEvent.change(screen.getByLabelText('Ordenar por'), { target: { value: 'attack' } })
    expect(onSortChange).toHaveBeenCalledWith('attack', 'ASC')

    fireEvent.change(screen.getByLabelText('Direção'), { target: { value: 'DESC' } })
    expect(onSortChange).toHaveBeenCalledWith('pokedexId', 'DESC')

    fireEvent.change(screen.getByLabelText('Itens por página'), { target: { value: '18' } })
    expect(onPageSizeChange).toHaveBeenCalledWith(18)
  })
})
