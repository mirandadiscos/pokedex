import { PokemonService } from '../src/services/pokemon.service';

describe('PokemonService', () => {
  it('normalizes query and delegates list to repository', async () => {
    const repository = {
      all: jest.fn().mockResolvedValue({
        data: [],
        pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
      }),
      findById: jest.fn(),
    };

    const service = new PokemonService(repository as never);

    await service.all({
      page: 0,
      pageSize: 0,
      search: '  pika  ',
      sortField: 'name',
      sortDirection: 'DESC',
    });

    expect(repository.all).toHaveBeenCalledWith({
      page: 1,
      pageSize: 1,
      search: 'pika',
      sortField: 'name',
      sortDirection: 'DESC',
    });
  });

  it('returns pokemon by id from repository', async () => {
    const repository = {
      all: jest.fn(),
      findById: jest.fn().mockResolvedValue({ id: 1, pokedexId: 1, name: 'Bulbasaur' }),
    };

    const service = new PokemonService(repository as never);
    const pokemon = await service.getById(1);

    expect(repository.findById).toHaveBeenCalledWith(1);
    expect(pokemon.name).toBe('Bulbasaur');
  });

  it('throws 404 when pokemon is not found', async () => {
    const repository = {
      all: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
    };

    const service = new PokemonService(repository as never);

    await expect(service.getById(999)).rejects.toMatchObject({
      message: 'Pokemon not found',
      statusCode: 404,
    });
  });
});
