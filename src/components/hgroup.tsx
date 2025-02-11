import React from 'react'
import { cn } from '~/lib/utils'
import { Heading } from '~/components/heading'

export interface HGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

const HGroup = React.forwardRef<HTMLDivElement, HGroupProps>(
  ({ title, subtitle, className, children, ...props }, ref) => {
    return (
      <hgroup ref={ref} className={cn('pb-12', className)} {...props}>
        <Heading variant="h1">{title}</Heading>
        {children}
        <p className="!mt-0 text-xl">{subtitle}</p>
      </hgroup>
    )
  },
)

HGroup.displayName = 'HGroup'

export { HGroup }
