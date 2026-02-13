import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { DB } from './db';
import { PokemonEntity } from '../entities/pokemon.entity';

interface CsvPokemonRow {
  pokedex_number: string;
  name: string;
  type_1: string;
  type_2: string;
  total: string;
  hp: string;
  attack: string;
  defense: string;
  sp_atk: string;
  sp_def: string;
  speed: string;
  generation: string;
  is_legendary: string;
}

const parseCsv = (raw: string): CsvPokemonRow[] => {
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length <= 1) {
    return [];
  }

  const [header, ...rows] = lines;
  const keys = header.split(',');

  return rows.map((line) => {
    const values = line.split(',');
    const row: Record<string, string> = {};

    for (let index = 0; index < keys.length; index += 1) {
      row[keys[index]] = values[index] ?? '';
    }

    return row as unknown as CsvPokemonRow;
  });
};

const mapCsvToEntity = (row: CsvPokemonRow): Partial<PokemonEntity> => ({
  pokedexId: Number(row.pokedex_number),
  name: row.name,
  type1: row.type_1,
  type2: row.type_2 || null,
  total: Number(row.total),
  hp: Number(row.hp),
  attack: Number(row.attack),
  defense: Number(row.defense),
  spAttack: Number(row.sp_atk),
  spDefense: Number(row.sp_def),
  speed: Number(row.speed),
  generation: Number(row.generation),
  legendary: row.is_legendary === '1',
  imageUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${Number(row.pokedex_number)}.png`,
});

export const seedDatabase = async (): Promise<void> => {
  if (!DB.isInitialized) {
    await DB.initialize();
  }

  const csvPath = path.resolve(__dirname, '../../../pokemon.csv');
  const rawCsv = await readFile(csvPath, 'utf-8');
  const parsed = parseCsv(rawCsv);
  const repository = DB.getRepository(PokemonEntity);

  await repository.clear();
  await repository.insert(parsed.map(mapCsvToEntity));
};

if (require.main === module) {
  seedDatabase()
    .then(async () => {
      await DB.destroy();
      console.log('Seed completed using TypeORM: pokemondb.sql');
    })
    .catch(async (error) => {
      console.error(error);
      if (DB.isInitialized) {
        await DB.destroy();
      }
      process.exit(1);
    });
}
