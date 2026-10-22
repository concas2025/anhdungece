'use client';

// Adapted from react-text-animate TextEffectTwo (MIT, see licenses/).
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

export function TextReveal({ text, className = '', active = true }: { text: string; className?: string; active?: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduced = useReducedMotion();
  return (
    <p ref={ref} className={className}>
      <span className='sr-only'>{text}</span>
      <span aria-hidden='true'>
        {text.split(' ').map((word, index) => (
          <motion.span key={index} initial={false}
            animate={{ opacity: reduced || (active && inView) ? 1 : 0, filter: reduced || (active && inView) ? 'blur(0px)' : 'blur(6px)' }}
            transition={{ duration: reduced ? 0 : 0.45, delay: reduced ? 0 : index * 0.025 }}>
            {word}{' '}
          </motion.span>
        ))}
      </span>
    </p>
  );
}
