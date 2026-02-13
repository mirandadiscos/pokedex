import { DataSource } from 'typeorm';
import { PokemonEntity } from '../entities/pokemon.entity';

export const DB = new DataSource({
  type: 'sqlite',
  database: 'pokemondb.sql',
  entities: [PokemonEntity],
  synchronize: true,
});
