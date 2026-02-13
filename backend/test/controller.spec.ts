import type { NextFunction, Request, Response } from 'express';
import { PokemonController } from '../src/controllers/pokemon.controller';

const createResponseMock = (): Response => {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return response as unknown as Response;
};

describe('PokemonController', () => {
  it('calls service.all and returns 200 for valid list query', async () => {
    const payload = {
      data: [],
      pagination: { page: 1, pageSize: 20, totalItems: 0, totalPages: 0 },
    };

    const service = {
      all: jest.fn().mockResolvedValue(payload),
      getById: jest.fn(),
    };

    const controller = new PokemonController(service as never);
    const req = { query: { page: '1', pageSize: '20' } } as unknown as Request;
    const res = createResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    await controller.all(req, res, next);

    expect(service.all).toHaveBeenCalledWith({ page: 1, pageSize: 20, sortDirection: 'ASC' });
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as unknown as jest.Mock)).toHaveBeenCalledWith(payload);
    expect(next).not.toHaveBeenCalled();
  });

  it('throws validation error for invalid list query', async () => {
    const service = {
      all: jest.fn(),
      getById: jest.fn(),
    };

    const controller = new PokemonController(service as never);
    const req = { query: { page: '0' } } as unknown as Request;
    const res = createResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    await expect(controller.all(req, res, next)).rejects.toMatchObject({ statusCode: 400 });
    expect(service.all).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('calls service.getById and returns 200', async () => {
    const pokemon = {
      id: 1,
      pokedexId: 1,
      name: 'Bulbasaur',
      type1: 'Grass',
      type2: 'Poison',
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
    };

    const service = {
      all: jest.fn(),
      getById: jest.fn().mockResolvedValue(pokemon),
    };

    const controller = new PokemonController(service as never);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = createResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    await controller.show(req, res, next);

    expect(service.getById).toHaveBeenCalledWith(1);
    expect((res.status as unknown as jest.Mock)).toHaveBeenCalledWith(200);
    expect((res.json as unknown as jest.Mock)).toHaveBeenCalledWith(pokemon);
    expect(next).not.toHaveBeenCalled();
  });

  it('throws when service.getById fails', async () => {
    const serviceError = new Error('database unavailable');
    const service = {
      all: jest.fn(),
      getById: jest.fn().mockRejectedValue(serviceError),
    };

    const controller = new PokemonController(service as never);
    const req = { params: { id: '1' } } as unknown as Request;
    const res = createResponseMock();
    const next = jest.fn() as unknown as NextFunction;

    await expect(controller.show(req, res, next)).rejects.toThrow('database unavailable');
    expect(next).not.toHaveBeenCalled();
  });
});
