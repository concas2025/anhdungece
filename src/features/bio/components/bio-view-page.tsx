'use client';

import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes';
import { ArrowDown, ArrowUpRight, Moon, Sun, Share2, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileHeader } from './profile-header';
import { BankQrCard } from './bank-qr-card';
import { SocialLinkCard } from './social-link-card';
import { QuickContactDialog } from './quick-contact-dialog';
import { SectionDock } from './section-dock';
import { WelcomeIntro } from '@/components/effects/welcome-intro';
import { HandwrittenName } from '@/components/effects/handwritten-name';
import { bioData } from '../data/links-data';

const ChromeBackground = dynamic(() => import('@/components/effects/chrome-background'), { ssr: false });

export function BioViewPage() {
  const { setTheme, resolvedTheme } = useTheme();
  const [ready, setReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const finishIntro = useCallback(() => {
    setReady(true);
    requestAnimationFrame(() => document.getElementById('profile-name')?.focus({ preventScroll: true }));
  }, []);
  useEffect(() => setMounted(true), []);

  const handleShare = async () => {
    const data = { title: bioData.name + ' | Bio Links', text: bioData.bio, url: window.location.href };
    try {
      if (navigator.share && navigator.canShare?.(data)) await navigator.share(data);
      else { await navigator.clipboard.writeText(data.url); toast.success('Đã sao chép đường dẫn trang cá nhân'); }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) toast.error('Chưa thể chia sẻ. Bạn có thể sao chép URL trên thanh địa chỉ.');
    }
  };
  const replay = () => {
    try { sessionStorage.removeItem('dung-welcome-v1'); } catch {}
    window.scrollTo({ top: 0, behavior: 'instant' });
    setReady(false);
    setIntroKey(key => key + 1);
  };

  return (
    <>
      <WelcomeIntro key={introKey} onComplete={finishIntro} />
      {ready && <ChromeBackground />}
      <div className={'site-shell ' + (ready ? 'site-shell--ready' : '')} inert={mounted && !ready}>
        <a href='#ket-noi' className='skip-link'>Đến danh sách liên kết</a>
        <SectionDock />
        <div className='page-content'>
          <header className='site-topbar'>
            <a href='#gioi-thieu' className='wordmark' aria-label='Phạm Anh Dũng — trang cá nhân'>AD<span>®</span><small>PERSONAL SPACE / 2026</small></a>
            <div className='topbar-actions'>
              <span className='topbar-location'>VIỆT NAM <span aria-hidden='true'>↗</span></span>
              <button className='metal-control icon-control' onClick={handleShare} aria-label='Chia sẻ trang cá nhân'><Share2 size={17} aria-hidden='true' /></button>
              {mounted && <button className='metal-control icon-control' onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')} aria-label={resolvedTheme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}>
                {resolvedTheme === 'dark' ? <Sun size={17} aria-hidden='true' /> : <Moon size={17} aria-hidden='true' />}
              </button>}
            </div>
          </header>
          <main>
            <section id='gioi-thieu' className='intro-section' aria-labelledby='profile-name'>
              <div className='section-kicker'><span className='status-dot' /> MỘT GÓC NHỎ TRÊN INTERNET <span className='kicker-line' /></div>
              <ProfileHeader profile={bioData} ready={ready} />
              <a href='#ket-noi' className='scroll-cue'><span>KHÁM PHÁ THÊM</span><ArrowDown size={15} aria-hidden='true' /></a>
            </section>
            <div className='information-grid'>
              <section id='ket-noi' className='links-section' aria-labelledby='links-title'>
                <div className='section-heading'><div><span className='section-number'>01 / KẾT NỐI</span><h2 id='links-title'>Tìm mình ở đây<span>.</span></h2></div><span className='count-label'>{bioData.socialLinks.length.toString().padStart(2, '0')} KÊNH</span></div>
                <p className='section-description'>Một lời chào, một ý tưởng, hay đơn giản là giữ liên lạc.</p>
                <div className='social-links'>{bioData.socialLinks.map((link, index) => <SocialLinkCard key={link.id} link={link} index={index} />)}</div>
              </section>
              <section id='chuyen-khoan' className='bank-section' aria-labelledby='bank-title'>
                <div className='section-heading'><div><span className='section-number'>02 / CHUYỂN KHOẢN</span><h2 id='bank-title'>Quét & kết nối<span>.</span></h2></div></div>
                <p className='section-description'>Thông tin ngân hàng của mình, gọn trong một mã QR.</p>
                <BankQrCard banks={bioData.banks} />
                <div className='bank-footnote'><span className='tiny-line' />Kiểm tra đúng tên người nhận trước khi chuyển khoản.</div>
              </section>
            </div>
            <section id='lien-he' className='contact-section glass-panel' aria-labelledby='contact-title'>
              <div><span className='section-number'>03 / MỘT CUỘC TRÒ CHUYỆN MỚI</span><h2 id='contact-title'>Bắt đầu từ một lời chào<span>.</span></h2><p>Công nghệ, một dự án thú vị, hay một điều bạn muốn chia sẻ.</p></div>
              <QuickContactDialog />
              <ArrowUpRight className='contact-decoration' aria-hidden='true' strokeWidth={0.6} />
            </section>
          </main>
          <footer className='site-footer'>
            <div className='footer-top'><span>CẢM ƠN BẠN ĐÃ GHÉ THĂM</span><button className='replay-button' onClick={replay}><RotateCcw size={13} aria-hidden='true' />Xem lại lời chào</button></div>
            <div className='footer-signature'><span className='sr-only'>{bioData.name}</span><HandwrittenName active={ready} /></div>
            <div className='footer-bottom'><span>© {new Date().getFullYear()} {bioData.name}</span><span>Electronics & Telecommunications</span><a href='#gioi-thieu' aria-label='Trở về đầu trang'>VỀ ĐẦU TRANG <ArrowUpRight size={13} aria-hidden='true' /></a></div>
          </footer>
        </div>
      </div>
      <noscript><style>{'.site-shell{opacity:1!important;visibility:visible!important}.welcome-overlay{display:none!important}'}</style><p className='noscript-notice'>Bật JavaScript để xem hiệu ứng và sử dụng các nút tương tác.</p></noscript>
    </>
  );
}
