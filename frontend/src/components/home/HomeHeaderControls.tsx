import { SearchInput } from '../common/SearchInput'
import type { PokemonListQuery, PokemonSortField } from '../../../../contracts/pokemon.types'

const SORT_OPTIONS: Array<{ value: PokemonSortField; label: string }> = [
  { value: 'pokedexId', label: 'Número da Pokédex' },
  { value: 'name', label: 'Nome' },
  { value: 'hp', label: 'HP' },
  { value: 'attack', label: 'Ataque' },
  { value: 'defense', label: 'Defesa' },
  { value: 'speed', label: 'Velocidade' },
]

interface HomeHeaderControlsProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  query: PokemonListQuery
  showFiltersMenu: boolean
  onToggleFilters: () => void
  onSortChange: (sortField: PokemonSortField, sortDirection: 'ASC' | 'DESC') => void
  onPageSizeChange: (pageSize: number) => void
}

export function HomeHeaderControls({
  searchInput,
  onSearchInputChange,
  query,
  showFiltersMenu,
  onToggleFilters,
  onSortChange,
  onPageSizeChange,
}: HomeHeaderControlsProps) {
  const currentSortField = query.sortField ?? 'pokedexId'
  const currentSortDirection = query.sortDirection ?? 'ASC'

  return (
    <div className="flex items-center gap-2">
      <div className="flex w-[320px] overflow-hidden rounded border border-slate-300 bg-white">
        <SearchInput
          value={searchInput}
          onChange={onSearchInputChange}
          placeholder="Buscar Pokémon..."
          className="border-0 py-2 focus:ring-0"
        />
        <button type="button" aria-label="Pesquisar" className="border-l border-slate-300 px-3 text-slate-600">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </button>
      </div>

      <div className="relative">
        <button type="button" onClick={onToggleFilters} className="rounded border border-slate-300 bg-white px-3 py-2 text-sm">
          Filtros ▼
        </button>

        {showFiltersMenu ? (
          <div className="absolute right-0 z-10 mt-2 w-72 space-y-3 rounded border border-slate-300 bg-white p-3">
            <label className="block text-sm">
              <span>Ordenar por</span>
              <select
                value={currentSortField}
                onChange={(event) => onSortChange(event.target.value as PokemonSortField, currentSortDirection)}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm">
              <span>Direção</span>
              <select
                value={currentSortDirection}
                onChange={(event) => onSortChange(currentSortField, event.target.value as 'ASC' | 'DESC')}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
              >
                <option value="ASC">Crescente</option>
                <option value="DESC">Decrescente</option>
              </select>
            </label>

            <label className="block text-sm">
              <span>Itens por página</span>
              <select
                value={query.pageSize}
                onChange={(event) => onPageSizeChange(Number(event.target.value))}
                className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5"
              >
                <option value={9}>9</option>
                <option value={18}>18</option>
                <option value={27}>27</option>
              </select>
            </label>
          </div>
        ) : null}
      </div>
    </div>
  )
}
