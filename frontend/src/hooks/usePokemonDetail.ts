import { useCallback, useEffect, useState } from 'react'
import { getPokemonById } from '../services/pokemon.service'
import type { Pokemon } from '../../../contracts/pokemon.types'

interface UsePokemonDetailResult {
  data: Pokemon | null
  isLoading: boolean
  error: string | null
  refetch: (forceRefresh?: boolean) => Promise<void>
}

export function usePokemonDetail(id?: number): UsePokemonDetailResult {
  const [data, setData] = useState<Pokemon | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPokemon = useCallback(
    async (forceRefresh = false): Promise<void> => {
      if (!id) {
        setData(null)
        setError('ID de Pokémon inválido')
        setIsLoading(false)
        return
      }

      setError(null)

      try {
        const response = await getPokemonById(id, { forceRefresh })
        setData(response)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao carregar Pokémon'
        setError(message)
      } finally {
        setIsLoading(false)
      }
    },
    [id],
  )

  useEffect(() => {
    fetchPokemon()
  }, [fetchPokemon])

  return {
    data,
    isLoading,
    error,
    refetch: fetchPokemon,
  }
}
