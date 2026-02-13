import { Router } from 'express';
import { PokemonController } from '../controllers/pokemon.controller';

export class PokemonRoutes {
  constructor(private readonly pokemonController: PokemonController) {}

  build(): Router {
    const router = Router();

    router.get('/pokemons', this.pokemonController.all);
    router.get('/pokemons/:id', this.pokemonController.show);

    return router;
  }
}
