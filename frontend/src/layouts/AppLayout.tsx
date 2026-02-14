import { useState } from 'react'
import type { ReactNode } from 'react'
import { Outlet } from 'react-router-dom'
import { HEADER_SLOT_CONTEXT } from './HeaderSlotContext'

export function AppLayout() {
  const [headerContent, setHeaderContent] = useState<ReactNode>(null)

  return (
    <HEADER_SLOT_CONTEXT.Provider value={setHeaderContent}>
      <div className="min-h-screen">
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
          <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex flex-nowrap items-center gap-4">
              <h1 className="shrink-0 text-2xl font-bold tracking-tight text-slate-900">Pokédex</h1>
              {headerContent ? (
                <div className="flex flex-1 justify-center">{headerContent}</div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </HEADER_SLOT_CONTEXT.Provider>
  )
}
