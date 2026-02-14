import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

type HeaderSlotSetter = (content: ReactNode) => void

export const HEADER_SLOT_CONTEXT = createContext<HeaderSlotSetter | null>(null)

export function useHeaderSlot(): HeaderSlotSetter {
  const context = useContext(HEADER_SLOT_CONTEXT)

  if (!context) {
    throw new Error('useHeaderSlot deve ser usado dentro de AppLayout')
  }

  return context
}
