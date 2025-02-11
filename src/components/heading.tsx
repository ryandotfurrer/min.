import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'

const headingVariants = cva(
  'text-balance font-semibold tracking-tight scroll-m-20 text-foreground',
  {
    variants: {
      variant: {
        h1: 'text-4xl lg:text-5xl',
        h2: 'text-3xl pb-2 first:mt-0',
        h3: 'text-2xl',
        h4: 'text-xl',
        h5: 'text-lg',
        h6: 'text-base',
      },
    },
  },
)

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  asChild?: boolean
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, ...props }, ref) => {
    const Comp = variant || 'h1'
    return (
      <Comp
        ref={ref}
        className={cn(headingVariants({ variant, className }))}
        {...props}
      />
    )
  },
)

Heading.displayName = 'Heading'

export { Heading, headingVariants }
