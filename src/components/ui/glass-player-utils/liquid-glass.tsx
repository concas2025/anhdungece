'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'frosted';
}

export function LiquidGlass({
  className,
  variant = 'default',
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <div
      data-slot="liquid-glass"
      className={cn(
        'liquid-glass',
        variant === 'frosted' && 'liquid-glass--frosted',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
