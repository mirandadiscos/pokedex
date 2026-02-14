import { validateListPokemonsQuery, validatePokemonIdParam } from '../src/validators/pokemon.validator';

describe('pokemon.validator', () => {
  it('returns defaults for list query when empty', () => {
    const value = validateListPokemonsQuery({});

    expect(value).toEqual({
      page: 1,
      pageSize: 20,
      sortDirection: 'ASC',
    });
  });

  it('converts and strips list query fields', () => {
    const value = validateListPokemonsQuery({
      page: '2',
      pageSize: '30',
      search: '  pikachu  ',
      sortField: '  name  ',
      sortDirection: 'DESC',
      ignored: 'x',
    });

    expect(value).toEqual({
      page: 2,
      pageSize: 30,
      search: 'pikachu',
      sortField: 'name',
      sortDirection: 'DESC',
    });
  });

  it('supports legacy sort/orientation keys', () => {
    const value = validateListPokemonsQuery({
      sort: 'name',
      orientation: 'desc',
    });

    expect(value).toEqual({
      page: 1,
      pageSize: 20,
      sortField: 'name',
      sortDirection: 'DESC',
    });
  });

  it('throws 400 for invalid list query', () => {
    try {
      validateListPokemonsQuery({ page: 0 });
      throw new Error('Expected validation error');
    } catch (error) {
      const validationError = error as Error & { statusCode?: number };
      expect(validationError.statusCode).toBe(400);
      expect(validationError.message).toContain('"page"');
    }
  });

  it('converts id param to number', () => {
    const id = validatePokemonIdParam({ id: '25' });

    expect(id).toBe(25);
  });

  it('throws 400 for invalid id param', () => {
    try {
      validatePokemonIdParam({ id: 'abc' });
      throw new Error('Expected validation error');
    } catch (error) {
      const validationError = error as Error & { statusCode?: number };
      expect(validationError.statusCode).toBe(400);
      expect(validationError.message).toContain('"id"');
    }
  });
});
