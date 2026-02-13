import { SearchInput } from '../common/SearchInput'

interface DetailHeaderSearchProps {
  searchInput: string
  onSearchInputChange: (value: string) => void
  onSubmit: (term: string) => void
}

export function DetailHeaderSearch({ searchInput, onSearchInputChange, onSubmit }: DetailHeaderSearchProps) {
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(searchInput)
      }}
    >
      <div className="flex w-[320px] overflow-hidden rounded border border-slate-300 bg-white">
        <SearchInput
          value={searchInput}
          onChange={onSearchInputChange}
          placeholder="Buscar Pokémon..."
          className="border-0 py-2 focus:ring-0"
        />
        <button type="submit" aria-label="Pesquisar" className="border-l border-slate-300 px-3 text-slate-600">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <line x1="16.65" y1="16.65" x2="21" y2="21" />
          </svg>
        </button>
      </div>
    </form>
  )
}
