import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type HeaderSlotSetter = (content: ReactNode) => void

export const HeaderSlotContext = createContext<HeaderSlotSetter | null>(null)

export function useHeaderSlot(): HeaderSlotSetter {
  const context = useContext(HeaderSlotContext)

  if (!context) {
    throw new Error('useHeaderSlot deve ser usado dentro de AppLayout')
  }

  return context
}
