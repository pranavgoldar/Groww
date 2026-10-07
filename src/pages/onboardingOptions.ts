import type { Familiarity, Goal } from '../data/types'

export const FAMILIARITY_OPTIONS: Array<{ value: Familiarity; label: string; hint: string }> = [
  { value: 'new', label: 'I’m completely new', hint: 'Plain language, with terms explained' },
  { value: 'basics', label: 'I know the basics', hint: 'Clear explanations, some financial terms' },
  { value: 'active', label: 'I actively follow markets', hint: 'Concise, fewer explainers' },
]

export const GOAL_OPTIONS: Array<{ value: Goal; label: string }> = [
  { value: 'stocks', label: 'Understand stocks' },
  { value: 'markets', label: 'Understand markets' },
  { value: 'learn', label: 'Learn investing' },
  { value: 'companies', label: 'Follow companies' },
]
