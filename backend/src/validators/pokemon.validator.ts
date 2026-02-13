import Joi from 'joi';
import type { Pokemon, PokemonListQuery } from '../../../contracts/pokemon.types';
import { HttpError } from '../errors/http.error';

const SORT_FIELDS: ReadonlyArray<keyof Pokemon> = [
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
];

export const listPokemonsQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  search: Joi.string().allow('').trim().optional(),
  sortField: Joi.string().trim().valid(...SORT_FIELDS).optional(),
  sortDirection: Joi.string().trim().valid('ASC', 'DESC').insensitive().uppercase().default('ASC'),
})
  .rename('sort', 'sortField', { ignoreUndefined: true, override: false })
  .rename('orientation', 'sortDirection', { ignoreUndefined: true, override: false });

export const pokemonIdParamSchema = Joi.object({
  id: Joi.number().integer().min(1).required().messages({
    'number.base': '"id" must be a number',
  }),
});

export const validateListPokemonsQuery = (input: unknown): PokemonListQuery => {
  const { value, error } = listPokemonsQuerySchema.validate(input, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    throw new HttpError(400, error.message, 'VALIDATION_ERROR', {
      validation: error.details.map((detail) => ({
        path: detail.path,
        message: detail.message,
      })),
    });
  }

  return value as PokemonListQuery;
};

export const validatePokemonIdParam = (input: unknown): number => {
  const { value, error } = pokemonIdParamSchema.validate(input, {
    abortEarly: false,
    convert: true,
    stripUnknown: true,
  });

  if (error) {
    throw new HttpError(400, error.message, 'VALIDATION_ERROR', {
      validation: error.details.map((detail) => ({
        path: detail.path,
        message: detail.message,
      })),
    });
  }

  return value.id as number;
};
