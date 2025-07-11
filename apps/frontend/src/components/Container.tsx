import clsx from 'clsx'

interface Props {
  children?: React.ReactNode
  className?: string
}

function Container({ children, className }: Props) {
  return (
    <div
      className={clsx('border border-[#d9d9d9] border-solid dark:border-[#424242] p-2 rounded-xs shrink-0', className)}
    >
      {children}
    </div>
  )
}

export { Container }
