'use client';
import * as React from 'react';
import { Dialog as DialogPrimitive } from '@base-ui/react/dialog';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;

export function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      className={cn('fixed inset-0 z-50 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in-0', className)}
      {...props}
    />
  );
}

export function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        className={cn(
          'fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg max-h-[calc(100dvh-2rem)] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-4 border border-border/80 bg-popover p-6 shadow-lg duration-200 rounded-2xl animate-in fade-in-0 zoom-in-95',
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          render={<Button variant='ghost' size='icon-xs' className='absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100' />}
        >
          <Icons.close className='h-4 w-4' />
          <span className='sr-only'>Đóng hộp thoại</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}

export function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />;
}

export function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)} {...props} />;
}

export function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title className={cn('text-lg font-semibold leading-none tracking-tight text-foreground', className)} {...props} />;
}

export function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return <DialogPrimitive.Description className={cn('text-sm text-muted-foreground', className)} {...props} />;
}
