import type { PaginatedResponse } from './pagination.types';
import type { Pokemon, PokemonListQuery } from './pokemon.types';

export interface PokemonApi {
  list(query: PokemonListQuery): Promise<PaginatedResponse<Pokemon>>;
  getById(id: number): Promise<Pokemon>;
}
