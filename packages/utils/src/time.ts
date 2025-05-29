import dayjs from 'dayjs'

export enum FormatOptions {
  DD = 'DD',
  YYYY_MM_DD = 'YYYY-MM-DD',
  YYYY_MM_DD_HH_mm = 'YYYY-MM-DD HH:mm',
  YYYY_MM_DD_HH_mm_ss = 'YYYY-MM-DD HH:mm:ss',
}

export function formatTime(date: string | number | dayjs.Dayjs | Date, f = FormatOptions.YYYY_MM_DD) {
  return dayjs(date).format(f)
}

export function getToday() {
  return formatTime(dayjs(), FormatOptions.YYYY_MM_DD)
}

export function getYesterday() {
  return formatTime(dayjs().subtract(1, 'day'), FormatOptions.YYYY_MM_DD)
}

const units = [
  { duration: 60 * 60 * 24 * 365, name: '年' },
  { duration: 60 * 60 * 24 * 30, name: '月' },
  { duration: 60 * 60 * 24, name: '天' },
  { duration: 60 * 60, name: '小时' },
  { duration: 60, name: '分钟' },
]

type TTimeAgo = '刚刚' | '未来' | '未知' | `${string}前` | `${string}秒前`

export function timeAgo(timestamp: number): TTimeAgo {
  const now = Date.now()
  const seconds = Math.floor((now - timestamp) / 1000)

  if (seconds < 0)
    return '未来'
  if (Number.isNaN(seconds))
    return '未知'

  for (const unit of units) {
    const interval = seconds / unit.duration

    if (interval >= 1)
      return `${Math.floor(interval)}${unit.name}前`
  }

  return seconds >= 30 ? `${seconds}秒前` : '刚刚'
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
