'use client';
import { useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { bioData } from '../data/links-data';

export function QuickContactDialog() {
  const [open, setOpen] = useState(false);
  const email = bioData.socialLinks.find(link => link.actionType === 'email')?.copyValue || '';
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const sender = String(data.get('sender') || '').trim();
    const message = String(data.get('message') || '').trim();
    if (!sender || !message) return;
    window.location.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Lời chào từ ' + sender) + '&body=' + encodeURIComponent(message + '\n\nThông tin liên hệ: ' + sender);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className='gap-3 rounded-full px-6 min-h-12' variant='outline' />}>
        Gửi một lời chào <ArrowUpRight size={17} aria-hidden='true' />
      </DialogTrigger>
      <DialogContent className='sm:max-w-[450px]'>
        <DialogHeader><DialogTitle className='flex items-center gap-2'><Mail size={20} aria-hidden='true' />Gửi lời nhắn cho Dũng</DialogTitle><DialogDescription>Soạn lời nhắn tại đây rồi mở ứng dụng email để gửi đến {email}.</DialogDescription></DialogHeader>
        <form onSubmit={submit} className='space-y-5 pt-2'>
          <div className='space-y-2'><Label htmlFor='sender'>Tên và thông tin liên hệ</Label><Input id='sender' name='sender' required maxLength={200} placeholder='Tên của bạn · Email hoặc số điện thoại' className='h-12' /></div>
          <div className='space-y-2'><Label htmlFor='message'>Lời nhắn của bạn</Label><Textarea id='message' name='message' required maxLength={3000} placeholder='Mình muốn trao đổi về…' rows={5} /></div>
          <p className='text-xs leading-relaxed text-muted-foreground'>Bạn sẽ kiểm tra và bấm gửi trong ứng dụng email. Hoặc liên hệ trực tiếp qua một trong các kênh trên trang.</p>
          <DialogFooter><Button type='button' variant='ghost' onClick={() => setOpen(false)}>Đóng</Button><Button type='submit'>Mở ứng dụng email <ArrowUpRight size={15} aria-hidden='true' /></Button></DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
