'use client';
import * as React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';

export function QuickContactDialog() {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const sender = formData.get('sender') as string;
    setTimeout(() => {
      setIsSubmitting(false);
      setOpen(false);
      toast.success('Tin nhắn đã được gửi đi thành công!', {
        description: `Cảm ơn ${sender || 'bạn'}, mình sẽ phản hồi qua email/zalo sớm nhất có thể.`
      });
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant='outline' className='w-full gap-2 border-border/80 bg-card/60 backdrop-blur-sm hover:bg-card/90 shadow-sm rounded-xl h-11 text-sm font-medium' />}>
        <Icons.chat className='h-4 w-4 text-primary' />
        Gửi Tin Nhắn Nhanh Trực Tiếp
      </DialogTrigger>

      <DialogContent className='sm:max-w-[425px] rounded-2xl'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg'>
            <Icons.send className='h-5 w-5 text-primary' />
            Gửi lời nhắn cho Dũng
          </DialogTitle>
          <DialogDescription>Để lại thông tin và lời nhắn, mình sẽ nhận được thông báo ngay lập tức.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4 pt-2'>
          <div className='space-y-1.5'>
            <Label htmlFor='sender' className='text-xs font-semibold'>Tên hoặc Kênh liên hệ của bạn *</Label>
            <Input id='sender' name='sender' placeholder='VD: Hoàng Nam (0912... hoặc nam@gmail.com)' required className='rounded-lg text-sm' />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='message' className='text-xs font-semibold'>Nội dung lời nhắn *</Label>
            <Textarea id='message' name='message' placeholder='Bạn cần trao đổi về dự án viễn thông, phần cứng hay kết nối công việc?' rows={4} required className='rounded-lg text-sm' />
          </div>
          <DialogFooter className='pt-2'>
            <Button type='button' variant='ghost' onClick={() => setOpen(false)} disabled={isSubmitting} className='rounded-lg'>Hủy</Button>
            <Button type='submit' disabled={isSubmitting} className='gap-2 rounded-lg'>
              {isSubmitting ? (<><Icons.spinner className='h-4 w-4 animate-spin' />Đang gửi...</>) : (<><Icons.send className='h-4 w-4' />Gửi ngay</>)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
