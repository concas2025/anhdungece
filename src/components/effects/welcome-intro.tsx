'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppleHelloEnglishEffect, AppleHelloVietnameseEffect } from './apple-hello-effect';

const STORAGE_KEY = 'dung-welcome-v1';

export function WelcomeIntro({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'checking' | 'hello' | 'vietnamese' | 'exit' | 'done'>('checking');
  const skipRef = useRef<HTMLButtonElement>(null);
  const finished = useRef(false);
  const complete = useCallback(() => {
    if (finished.current) return;
    finished.current = true;
    try { sessionStorage.setItem(STORAGE_KEY, 'seen'); } catch { /* Storage can be disabled. */ }
    setPhase('done');
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(STORAGE_KEY) === 'seen'; } catch { /* Intro still works. */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { complete(); return; }
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    setPhase('hello');
    skipRef.current?.focus({ preventScroll: true });
    const timers = [
      window.setTimeout(() => { if (!finished.current) setPhase('vietnamese'); }, 1700),
      window.setTimeout(() => { if (!finished.current) setPhase('exit'); }, 4300),
      window.setTimeout(complete, 4700),
    ];
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onReduced = () => { if (media.matches) complete(); };
    media.addEventListener('change', onReduced);
    return () => {
      timers.forEach(clearTimeout);
      media.removeEventListener('change', onReduced);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
    };
  }, [complete]);

  // Release the scroll lock immediately, including Skip and Escape.
  useEffect(() => {
    if (phase === 'done') document.body.style.overflow = '';
  }, [phase]);

  if (phase === 'done') return null;
  return (
    <motion.div className='welcome-overlay' role='dialog' aria-modal='true' aria-label='Lời chào từ Phạm Anh Dũng'
      animate={{ opacity: phase === 'exit' ? 0 : 1 }} transition={{ duration: 0.4 }}
      onKeyDown={event => {
        if (event.key === 'Escape') complete();
        if (event.key === 'Tab') { event.preventDefault(); skipRef.current?.focus(); }
      }}>
      <div className='welcome-brand'><span className='brand-monogram'>AD<span>®</span></span><span>MỘT CHÚT KẾT NỐI.</span></div>
      <div className='welcome-center'>
        <AnimatePresence mode='wait'>
          {phase !== 'exit' && phase !== 'checking' && (
            <motion.div key={phase} className='welcome-word' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
              {phase === 'hello' ? <AppleHelloEnglishEffect speed={0.38} /> : <AppleHelloVietnameseEffect speed={0.28} />}
            </motion.div>
          )}
        </AnimatePresence>
        <p className='welcome-caption'>RẤT VUI VÌ BẠN ĐÃ GHÉ QUA</p>
      </div>
      <button ref={skipRef} onClick={complete} className='welcome-skip metal-control'>Bỏ qua lời chào <span aria-hidden='true'>↗</span></button>
      <div className='welcome-progress' aria-hidden='true'><span /></div>
    </motion.div>
  );
}
