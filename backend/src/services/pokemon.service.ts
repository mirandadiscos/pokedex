import type { PaginatedResponse } from '../../../contracts/pagination.types';
import type { Pokemon, PokemonListQuery } from '../../../contracts/pokemon.types';
import { HttpError } from '../errors/http.error';
import { PokemonRepository } from '../repositories/pokemon.repository';

export class PokemonService {
  constructor(private readonly pokemonRepository: PokemonRepository) {}

  async all(query: PokemonListQuery): Promise<PaginatedResponse<Pokemon>> {
    const normalizedQuery: PokemonListQuery = {
      page: Math.max(1, Math.trunc(query.page ?? 1)),
      pageSize: Math.max(1, Math.trunc(query.pageSize ?? 20)),
      search: query.search?.trim() || undefined,
      sortField: query.sortField,
      sortDirection: query.sortDirection === 'DESC' ? 'DESC' : 'ASC',
    };

    return this.pokemonRepository.all(normalizedQuery);
  }

  async getById(id: number): Promise<Pokemon> {
    const pokemon = await this.pokemonRepository.findById(id);

    if (!pokemon) {
      throw new HttpError(404, 'Pokemon not found', 'NOT_FOUND');
    }

    return pokemon;
  }
}
