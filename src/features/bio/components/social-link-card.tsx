'use client';
import * as React from 'react';
import { Icons } from '@/components/icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { SocialLinkItem } from '../types';
import { cn } from '@/lib/utils';

export function SocialLinkCard({ link }: { link: SocialLinkItem }) {
  const [copied, setCopied] = React.useState(false);
  const IconComponent = Icons[link.iconName] || Icons.externalLink;

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const textToCopy = link.copyValue || link.url;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      toast.success(`Đã sao chép ${link.title}!`, { description: textToCopy });
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      toast.error('Không thể sao chép');
    });
  };

  const handleCardClick = () => {
    window.open(link.url, link.actionType === 'link' ? '_blank' : '_self', 'noopener,noreferrer');
  };

  return (
    <div
      onClick={handleCardClick}
      role='button'
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        'group relative flex items-center justify-between w-full p-3.5 sm:p-4 rounded-xl border border-border/60 bg-card/75 backdrop-blur-md',
        'hover:border-primary/50 hover:bg-card/95 hover:shadow-md hover:scale-[1.015] active:scale-[0.99] transition-all duration-200 cursor-pointer select-none text-left'
      )}
    >
      <div className='flex items-center gap-3.5 min-w-0 flex-1 pr-2'>
        <div className={cn('flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105 shadow-2xs', link.brandColor || 'bg-primary/10 text-primary')}>
          <IconComponent className='size-5' />
        </div>
        <div className='min-w-0 flex-1'>
          <div className='flex items-center gap-2'>
            <span className='font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate'>{link.title}</span>
            {link.badge && (
              <Badge variant={link.badge.variant || 'secondary'} className='text-[10px] px-1.5 py-0 font-normal shrink-0'>
                {link.badge.text}
              </Badge>
            )}
          </div>
          <p className='text-xs text-muted-foreground truncate group-hover:text-muted-foreground/90'>{link.username}</p>
        </div>
      </div>

      <div className='flex items-center gap-1.5 shrink-0'>
        {link.copyValue && (
          <TooltipProvider delay={150}>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type='button'
                    variant='ghost'
                    size='icon-sm'
                    onClick={handleCopy}
                    className='text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg'
                    aria-label={`Copy ${link.title}`}
                  />
                }
              >
                {copied ? <Icons.check className='size-3.5 text-emerald-500' /> : <Icons.copy className='size-3.5' />}
              </TooltipTrigger>
              <TooltipContent side='top'>{copied ? 'Đã sao chép' : `Sao chép ${link.title}`}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        <div className='flex size-7 items-center justify-center rounded-full text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all'>
          {link.actionType === 'email' ? <Icons.send className='size-4' /> : <Icons.chevronRight className='size-4' />}
        </div>
      </div>
    </div>
  );
}
