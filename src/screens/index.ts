import type { FC } from 'react'
import type { ScreenId } from '../state/store'
import { Explore, Start } from './Start'
import { Basics } from './Basics'
import { MonthlyPlan } from './MonthlyPlan'
import { Categories, Order } from './Categories'
import { Commit } from './Commit'
import { SalaryDay } from './SalaryDay'
import { CheckIn, Noted } from './CheckIn'
import { NeedChanged } from './NeedChanged'
import { Portfolio } from './Portfolio'
import { GoalNear } from './GoalNear'
import { MyPlan } from './MyPlan'
import { PayMode } from './PayMode'

export const SCREEN_VIEWS: Record<ScreenId, FC> = {
  start: Start,
  explore: Explore,
  basics: Basics,
  plan: MonthlyPlan,
  categories: Categories,
  order: Order,
  commit: Commit,
  salary: SalaryDay,
  checkin: CheckIn,
  noted: Noted,
  need: NeedChanged,
  portfolio: Portfolio,
  goalNear: GoalNear,
  myPlan: MyPlan,
  payMode: PayMode,
}
