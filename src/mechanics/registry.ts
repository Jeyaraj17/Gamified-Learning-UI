import type { ComponentType } from 'react'
import type { MechanicProps } from '../types'
import { RunnerGame } from './RunnerGame'

export const MECHANIC_REGISTRY: Record<string, ComponentType<MechanicProps>> = {
  runner: RunnerGame,
}
