'use client';

import { useEffect, useRef, useState } from 'react';
import { UserRound, Link2, QrCode, Send } from 'lucide-react';
import { createTopDockController } from '@/lib/threeui/topDockController';

const sections = [
  { id: 'gioi-thieu', label: 'Giới thiệu', icon: UserRound },
  { id: 'ket-noi', label: 'Kết nối', icon: Link2 },
  { id: 'chuyen-khoan', label: 'Chuyển khoản', icon: QrCode },
  { id: 'lien-he', label: 'Liên hệ', icon: Send },
];

export function SectionDock() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState('gioi-thieu');
  useEffect(() => {
    if (!root.current) return;
    return createTopDockController(root.current, () => ({
      axis: window.innerWidth >= 1180 ? 'y' : 'x',
      proximity: 70, spring: 0.19, damping: 0.7, widthGrowth: 8, heightGrowth: 9, drop: 3,
    }));
  }, []);
  useEffect(() => {
    const update = () => {
      // The last section above the viewport's reading line wins, including tall sections.
      const line = window.innerHeight * 0.38;
      let current = sections[0].id;
      sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element && element.getBoundingClientRect().top <= line) current = section.id;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) current = 'lien-he';
      setActive(current);
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return (
    <aside className='section-dock' data-dock-frame>
      <a href='#gioi-thieu' className='dock-monogram' aria-label='Về phần giới thiệu'>AD<span>®</span></a>
      <span className='dock-divider' aria-hidden='true' />
      <nav ref={root} aria-label='Các mục thông tin'>
        {sections.map(({ id, label, icon: Icon }, index) => (
          <a key={id} href={`#${id}`} data-dock-item aria-current={active === id ? 'location' : undefined}
            onClick={() => setActive(id)} className='dock-item'>
            <Icon size={19} strokeWidth={1.5} aria-hidden='true' /><span>{label}</span><small>0{index + 1}</small>
          </a>
        ))}
      </nav>
      <span className='dock-indicator' aria-hidden='true' />
    </aside>
  );
}
