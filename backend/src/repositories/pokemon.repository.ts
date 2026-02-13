import { Like, type FindManyOptions, type FindOptionsOrder, type Repository } from 'typeorm';
import type { PaginatedResponse } from '../../../contracts/pagination.types';
import type { Pokemon, PokemonListQuery } from '../../../contracts/pokemon.types';
import { PokemonEntity } from '../entities/pokemon.entity';

export class PokemonRepository {
  private static readonly DEFAULT_SORT_FIELD: keyof PokemonEntity = 'pokedexId';
  private static readonly SORTABLE_FIELDS: ReadonlySet<keyof PokemonEntity> = new Set([
    'id',
    'pokedexId',
    'name',
    'type1',
    'type2',
    'total',
    'hp',
    'attack',
    'defense',
    'spAttack',
    'spDefense',
    'speed',
    'generation',
    'legendary',
  ]);

  constructor(private readonly repository: Repository<PokemonEntity>) {}

  async all(query: PokemonListQuery): Promise<PaginatedResponse<Pokemon>> {
    const params: FindManyOptions<PokemonEntity> = {
      where: query.search ? { name: Like(`%${query.search.trim()}%`) } : undefined,
      order: this.setOrder(query.sortField, query.sortDirection),
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    };

    const [rows, totalItems] = await this.repository.findAndCount(params);
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / query.pageSize);

    return {
      data: rows.map((row) => this.mapPokemon(row)),
      pagination: {
        page: query.page,
        pageSize: query.pageSize,
        totalItems,
        totalPages,
      },
    };
  }

  async findById(id: number): Promise<Pokemon | null> {
    const row = await this.repository.findOne({ where: { pokedexId: id } });
    return row ? this.mapPokemon(row) : null;
  }

  private setOrder(
    sortField?: string,
    sortDirection: 'ASC' | 'DESC' = 'ASC',
  ): FindOptionsOrder<PokemonEntity> {
    const field = this.resolveSortField(sortField);
    return { [field]: sortDirection };
  }

  private resolveSortField(sortField?: string): keyof PokemonEntity {
    const normalizedField = sortField?.trim() as keyof PokemonEntity | undefined;

    if (normalizedField && PokemonRepository.SORTABLE_FIELDS.has(normalizedField)) {
      return normalizedField;
    }

    return PokemonRepository.DEFAULT_SORT_FIELD;
  }

  private mapPokemon(row: PokemonEntity): Pokemon {
    return {
      id: row.id,
      pokedexId: row.pokedexId,
      name: row.name,
      type1: row.type1,
      type2: row.type2,
      total: row.total,
      hp: row.hp,
      attack: row.attack,
      defense: row.defense,
      spAttack: row.spAttack,
      spDefense: row.spDefense,
      speed: row.speed,
      generation: row.generation,
      legendary: row.legendary,
      imageUrl: row.imageUrl,
    };
  }
}
