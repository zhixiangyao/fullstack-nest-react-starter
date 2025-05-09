import dayjs from 'dayjs'

enum FormatOptions {
  YYYY_MM_DD = 'YYYY-MM-DD',
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
