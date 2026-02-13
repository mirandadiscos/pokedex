import { PokemonRoutes } from '../src/routes/pokemon.routes';
import { PokemonController } from '../src/controllers/pokemon.controller';

describe('PokemonRoutes', () => {
  it('registers GET /pokemons and GET /pokemons/:id', () => {
    const controller = new PokemonController({
      all: jest.fn(),
      getById: jest.fn(),
    } as never);

    const router = new PokemonRoutes(controller).build();
    const stack = (router as unknown as { stack: Array<{ route?: { path: string; methods: Record<string, boolean> } }> }).stack;

    const routes = stack
      .filter((layer) => layer.route)
      .map((layer) => ({
        path: layer.route!.path,
        methods: layer.route!.methods,
      }));

    expect(routes).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ path: '/pokemons', methods: expect.objectContaining({ get: true }) }),
        expect.objectContaining({ path: '/pokemons/:id', methods: expect.objectContaining({ get: true }) }),
      ]),
    );
  });
});
