import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pokemon' })
export class PokemonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column({ type: 'int' })
  pokedexId: number;

  @Index()
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  type1: string;

  @Column({ type: 'varchar', nullable: true })
  type2: string | null;

  @Column({ type: 'int' })
  total: number;

  @Column({ type: 'int' })
  hp: number;

  @Column({ type: 'int' })
  attack: number;

  @Column({ type: 'int' })
  defense: number;

  @Column({ type: 'int' })
  spAttack: number;

  @Column({ type: 'int' })
  spDefense: number;

  @Column({ type: 'int' })
  speed: number;

  @Column({ type: 'int' })
  generation: number;

  @Column({ type: 'boolean' })
  legendary: boolean;

  @Column({ type: 'varchar', nullable: true })
  imageUrl: string | null;
}
