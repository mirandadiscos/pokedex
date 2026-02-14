import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { DetailHeaderSearch } from '../src/components/detail/DetailHeaderSearch'

describe('DetailHeaderSearch', () => {
  it('envia o termo atual no submit', () => {
    const onSubmit = vi.fn()

    render(<DetailHeaderSearch searchInput="charizard" onSearchInputChange={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: 'Pesquisar' }))
    expect(onSubmit).toHaveBeenCalledWith('charizard')
  })
})
