import { DB } from './db/db';
import { PokemonController } from './controllers/pokemon.controller';
import { PokemonEntity } from './entities/pokemon.entity';
import { PokemonRepository } from './repositories/pokemon.repository';
import { PokemonService } from './services/pokemon.service';

export interface AppContainer {
  pokemonRepository: PokemonRepository;
  pokemonService: PokemonService;
  pokemonController: PokemonController;
}

export const buildContainer = async (): Promise<AppContainer> => {
  if (!DB.isInitialized) {
    await DB.initialize();
  }

  const pokemonOrmRepository = DB.getRepository(PokemonEntity);
  const pokemonRepository = new PokemonRepository(pokemonOrmRepository);
  const pokemonService = new PokemonService(pokemonRepository);
  const pokemonController = new PokemonController(pokemonService);

  return {
    pokemonRepository,
    pokemonService,
    pokemonController,
  };
};
