import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-black tracking-tight ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:     'bg-primary text-primary-foreground shadow-card-blue hover:opacity-90',
        secondary:   'bg-secondary text-secondary-foreground shadow-card-green hover:opacity-90',
        outline:     'border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-primary-foreground',
        ghost:       'text-foreground hover:bg-muted',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        ink:         'bg-ink text-white border-2 border-ink hover:bg-transparent hover:text-ink',
        orange:      'bg-brand-orange text-white hover:opacity-90 shadow-[0_4px_20px_rgba(249,115,22,0.25)]',
        purple:      'bg-brand-purple text-white hover:opacity-90 shadow-[0_4px_20px_rgba(139,92,246,0.25)]',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm:      'h-9 px-4 text-xs',
        lg:      'h-12 px-8 text-base',
        icon:    'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
