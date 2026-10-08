import type { FC } from 'react'
import type { ScreenId } from '../state/store'
import { Explore, Start } from './Start'
import { Basics } from './Basics'
import { PickPlan } from './PickPlan'
import { MonthlyPlan } from './MonthlyPlan'
import { Categories, Order } from './Categories'
import { Commit, Invested } from './Commit'
import { SalaryDay } from './SalaryDay'
import { CheckIn, Noted } from './CheckIn'
import { NeedChanged } from './NeedChanged'
import { Portfolio } from './Portfolio'

export const SCREEN_VIEWS: Record<ScreenId, FC> = {
  start: Start,
  explore: Explore,
  basics: Basics,
  pick: PickPlan,
  plan: MonthlyPlan,
  categories: Categories,
  order: Order,
  commit: Commit,
  invested: Invested,
  salary: SalaryDay,
  checkin: CheckIn,
  noted: Noted,
  need: NeedChanged,
  portfolio: Portfolio,
}
