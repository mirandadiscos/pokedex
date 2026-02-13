import type { NextFunction, Request, Response } from 'express';
import { PokemonService } from '../services/pokemon.service';
import { validateListPokemonsQuery, validatePokemonIdParam } from '../validators/pokemon.validator';

export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  all = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const query = validateListPokemonsQuery(req.query);
    const result = await this.pokemonService.all(query);
    res.status(200).json(result);
  };

  show = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const id = validatePokemonIdParam(req.params);
    const pokemon = await this.pokemonService.getById(id);
    res.status(200).json(pokemon);
  };
}
