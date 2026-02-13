export interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  type1: string;
  type2: string | null;
  total: number;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  generation: number;
  legendary: boolean;
  imageUrl: string | null;
}

export type PokemonSortField =
  | 'id'
  | 'pokedexId'
  | 'name'
  | 'type1'
  | 'type2'
  | 'total'
  | 'hp'
  | 'attack'
  | 'defense'
  | 'spAttack'
  | 'spDefense'
  | 'speed'
  | 'generation'
  | 'legendary';

export interface PokemonListQuery {
  page: number;
  pageSize: number;
  search?: string;
  sortField?: PokemonSortField;
  sortDirection?: 'ASC' | 'DESC';
}
