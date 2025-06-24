import dayjs from 'dayjs'

export const FormatOptions = {
  DD: 'DD',
  YYYY_MM_DD: 'YYYY-MM-DD',
  YYYY_MM_DD_HH_mm: 'YYYY-MM-DD HH:mm',
  YYYY_MM_DD_HH_mm_ss: 'YYYY-MM-DD HH:mm:ss',
} as const

export type FormatOptionsValue = (typeof FormatOptions)[keyof typeof FormatOptions]

export function formatTime(
  date: string | number | dayjs.Dayjs | Date,
  f: FormatOptionsValue = FormatOptions.YYYY_MM_DD,
) {
  return dayjs(date).format(f)
}

export function getToday() {
  return formatTime(dayjs(), FormatOptions.YYYY_MM_DD)
}

export function getYesterday() {
  return formatTime(dayjs().subtract(1, 'day'), FormatOptions.YYYY_MM_DD)
}

const units = [
  { duration: 60 * 60 * 24 * 365, name: 'Years' },
  { duration: 60 * 60 * 24 * 30, name: 'Months' },
  { duration: 60 * 60 * 24, name: 'Days' },
  { duration: 60 * 60, name: 'Hours' },
  { duration: 60, name: 'Minutes' },
]

type TTimeAgo = 'Just Now' | 'Future' | 'Unknown' | `${string} Ago` | `${string} Seconds Ago`

export function timeAgo(timestamp: number): TTimeAgo {
  const now = Date.now()
  const seconds = Math.floor((now - timestamp) / 1000)

  if (seconds < 0)
    return 'Future'
  if (Number.isNaN(seconds))
    return 'Unknown'

  for (const unit of units) {
    const interval = seconds / unit.duration

    if (interval >= 1)
      return `${Math.floor(interval)} ${unit.name} Ago`
  }

  return seconds >= 30 ? `${seconds} Seconds Ago` : 'Just Now'
}

export function getColorByDate(timestamp: number) {
  const now = Date.now()
  const seconds = Math.floor((now - timestamp) / 1000)

  if (seconds < 60 * 60)
    return 'green'

  if (seconds < 60 * 60 * 24)
    return 'orange'

  if (seconds < 60 * 60 * 24 * 3)
    return 'blue'
  return void 0
}
