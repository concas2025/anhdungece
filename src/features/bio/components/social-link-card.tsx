'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, Copy } from 'lucide-react';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { SocialLinkItem } from '../types';

export function SocialLinkCard({ link, index }: { link: SocialLinkItem; index: number }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const Icon = Icons[link.iconName];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link.copyValue || link.url);
      setCopied(true); toast.success('Đã sao chép ' + link.title);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2000);
    } catch { toast.error('Không thể sao chép. Vui lòng thử lại.'); }
  };
  return (
    <div className='social-card metal-surface'>
      <a className='social-card-link' href={link.url} target={link.actionType === 'link' ? '_blank' : undefined} rel={link.actionType === 'link' ? 'noopener noreferrer' : undefined}>
        <span className={'social-icon ' + link.id}><Icon size={22} stroke={1.6} aria-hidden='true' /></span>
        <span className='social-card-text'><strong>{link.title}</strong><span>{link.username}</span></span>
        <ArrowUpRight size={18} className='social-arrow' aria-hidden='true' />
      </a>
      {link.copyValue ? <button className='social-copy' onClick={copy} aria-label={'Sao chép ' + link.title} title={'Sao chép ' + link.title}>{copied ? <Check size={15} aria-hidden='true' /> : <Copy size={15} aria-hidden='true' />}</button> : <span className='social-index' aria-hidden='true'>{(index + 1).toString().padStart(2, '0')}</span>}
    </div>
  );
}
