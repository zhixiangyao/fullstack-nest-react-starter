import dayjs from 'dayjs'

export enum FormatOptions {
  DD = 'DD',
  YYYY_MM_DD = 'YYYY-MM-DD',
  YYYY_MM_DD_HH_mm = 'YYYY-MM-DD HH:mm',
}

export function formatTime(date: string | number | dayjs.Dayjs | Date, f = FormatOptions.YYYY_MM_DD_HH_mm) {
  return dayjs(date).format(f)
}
