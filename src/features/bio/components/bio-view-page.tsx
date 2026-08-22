'use client';
import * as React from 'react';
import { ProfileHeader } from './profile-header';
import { BankQrCard } from './bank-qr-card';
import { SocialLinkCard } from './social-link-card';
import { QuickContactDialog } from './quick-contact-dialog';
import { bioData } from '../data/links-data';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export function BioViewPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: `${bioData.name} | Bio Links`,
      text: bioData.bio,
      url: typeof window !== 'undefined' ? window.location.href : ''
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try { await navigator.share(shareData); } catch {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép đường dẫn trang cá nhân!');
    }
  };

  const toggleTheme = () => {
    const isDark = resolvedTheme === 'dark' || theme === 'dark';
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <div className='relative min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-between p-4 sm:p-6 md:py-10 transition-colors duration-300'>
      <div className='pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40 dark:opacity-25' aria-hidden='true'>
        <div className='absolute -top-[15%] left-[50%] -translate-x-1/2 h-[450px] w-[500px] rounded-full bg-primary/20 blur-[130px]' />
        <div className='absolute top-[40%] -left-[10%] h-[350px] w-[350px] rounded-full bg-sky-500/15 blur-[120px]' />
        <div className='absolute -bottom-[10%] -right-[10%] h-[350px] w-[350px] rounded-full bg-purple-500/15 blur-[120px]' />
      </div>

      <div className='relative z-10 w-full max-w-lg flex items-center justify-between pb-2'>
        <Button variant='ghost' size='sm' onClick={handleShare} className='rounded-full h-8 px-3 text-xs gap-1.5 text-muted-foreground hover:text-foreground bg-card/40 backdrop-blur-md border border-border/40'>
          <Icons.share className='size-3.5' />
          <span>Chia sẻ</span>
        </Button>

        {mounted && (
          <Button variant='ghost' size='icon-sm' onClick={toggleTheme} className='rounded-full size-8 text-muted-foreground hover:text-foreground bg-card/40 backdrop-blur-md border border-border/40' aria-label='Toggle theme'>
            {resolvedTheme === 'dark' ? <Icons.sun className='size-4' /> : <Icons.moon className='size-4' />}
          </Button>
        )}
      </div>

      <main className='relative z-10 w-full max-w-lg flex flex-col items-center space-y-6'>
        <ProfileHeader profile={bioData} />
        <BankQrCard banks={bioData.banks} />
        <div className='w-full space-y-3'>
          <div className='flex items-center justify-between px-1'>
            <h2 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground'>Danh sách liên hệ & Mạng xã hội</h2>
            <span className='text-[11px] text-muted-foreground'>${bioData.socialLinks.length} kênh</span>
          </div>
          <div className='flex flex-col gap-2.5 w-full'>
            {bioData.socialLinks.map((link) => (
              <SocialLinkCard key={link.id} link={link} />
            ))}
          </div>
        </div>
        <div className='w-full pt-1'>
          <QuickContactDialog />
        </div>
      </main>

      <footer className='relative z-10 mt-12 text-center text-xs text-muted-foreground/70 space-y-1'>
        <p>© {new Date().getFullYear()} • {bioData.name}</p>
        <p className='text-[11px] opacity-70'>Electronics & Telecommunications Engineer</p>
      </footer>
    </div>
  );
}
