/** How the plan's monthly money goes in: the user confirms each month, or opts into autopay on a fixed day and time. */
export type PayMode = 'manual' | 'autopay'

export const PAY_HOURS = [10, 12, 15, 18, 21]
export const REMIND_HOURS_BEFORE = 3

export const hourText = (h: number) => `${((h + 11) % 12) + 1}:00 ${h < 12 ? 'AM' : 'PM'}`

export function ordinal(n: number): string {
  const v = n % 100
  if (v >= 11 && v <= 13) return `${n}th`
  return `${n}${['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'}`
}

/** "2nd at 10:00 AM" */
export const autopayShort = (day: number, hour: number) => `${ordinal(day)} at ${hourText(hour)}`

/** "the 2nd of every month at 10:00 AM" */
export const autopayWhen = (day: number, hour: number) => `the ${ordinal(day)} of every month at ${hourText(hour)}`
