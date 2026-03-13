type CalendarDay = {
  date: Date
  inCurrentMonth: boolean
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * Retorna uma grade mensal de 6 semanas para manter o calendario estavel.
 */
export function getMonthGrid(referenceDate: Date): CalendarDay[] {
  const monthStart = new Date(
    referenceDate.getFullYear(),
    referenceDate.getMonth(),
    1,
  )
  const gridStart = new Date(monthStart)
  gridStart.setDate(monthStart.getDate() - monthStart.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart)
    date.setDate(gridStart.getDate() + index)

    return {
      date,
      inCurrentMonth: date.getMonth() === referenceDate.getMonth(),
    }
  })
}

export function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1)
}

export function isSameDay(left: Date | string, right: Date | string) {
  const leftDate = typeof left === 'string' ? new Date(left) : left
  const rightDate = typeof right === 'string' ? new Date(right) : right

  return startOfDay(leftDate).getTime() === startOfDay(rightDate).getTime()
}

export function isToday(date: Date) {
  return isSameDay(date, new Date())
}
