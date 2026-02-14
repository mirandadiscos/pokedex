import { PokemonRepository } from '../src/repositories/pokemon.repository';

describe('PokemonRepository', () => {
  it('queries list with pagination/search/sort and maps pagination', async () => {
    const ormRepository = {
      findAndCount: jest.fn().mockResolvedValue([
        [
          {
            id: 25,
            pokedexId: 25,
            name: 'Pikachu',
            type1: 'electric',
            type2: null,
            total: 320,
            hp: 35,
            attack: 55,
            defense: 40,
            spAttack: 50,
            spDefense: 50,
            speed: 90,
            generation: 1,
            legendary: false,
            imageUrl: null,
          },
        ],
        1,
      ]),
      findOne: jest.fn(),
    };

    const repository = new PokemonRepository(ormRepository as never);
    const result = await repository.all({
      page: 1,
      pageSize: 20,
      search: 'Pika',
      sortField: 'name',
      sortDirection: 'DESC',
    });

    expect(ormRepository.findAndCount).toHaveBeenCalledWith({
      where: { name: expect.any(Object) },
      order: { name: 'DESC' },
      skip: 0,
      take: 20,
    });
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 20,
      totalItems: 1,
      totalPages: 1,
    });
    expect(result.data[0].name).toBe('Pikachu');
  });

  it('uses pokedexId ascending when sort is invalid', async () => {
    const ormRepository = {
      findAndCount: jest.fn().mockResolvedValue([[], 0]),
      findOne: jest.fn(),
    };

    const repository = new PokemonRepository(ormRepository as never);
    await repository.all({ page: 1, pageSize: 10 });

    expect(ormRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        order: { pokedexId: 'ASC' },"skip":0,"take":10, "where": undefined
      }),
    );
  });

  it('returns pokemon by pokedex id', async () => {
    const ormRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn().mockResolvedValue({
        id: 1,
        pokedexId: 1,
        name: 'Bulbasaur',
        type1: 'grass',
        type2: 'poison',
        total: 318,
        hp: 45,
        attack: 49,
        defense: 49,
        spAttack: 65,
        spDefense: 65,
        speed: 45,
        generation: 1,
        legendary: false,
        imageUrl: null,
      }),
    };

    const repository = new PokemonRepository(ormRepository as never);
    const result = await repository.findById(1);

    expect(ormRepository.findOne).toHaveBeenCalledWith({ where: { pokedexId: 1 } });
    expect(result?.name).toBe('Bulbasaur');
  });
});
