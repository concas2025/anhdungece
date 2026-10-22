'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';

// Original monoline lettering. Diacritics are separate pen strokes, not a font outline.
const strokes = [
  'M15 108 Q31 54 42 24 M25 51 C7 41 27 13 53 20 C91 30 74 69 33 64',
  'M72 106 C82 74 108 17 101 14 C91 10 79 66 75 91 C92 54 115 56 111 78 L106 94 Q104 110 124 98',
  'M162 71 C145 51 120 80 126 99 C131 116 151 99 164 69 L154 96 Q150 112 174 98',
  'M173 98 L183 64 L175 102 C195 58 213 57 203 88 L199 103 C219 56 238 58 229 89 Q222 111 246 98',
  'M141 125 L142 126',
  'M273 106 C289 76 313 31 328 22 C327 50 322 78 324 100 Q325 111 341 99 M285 81 Q310 74 334 77',
  'M340 99 L350 66 L343 102 C361 61 384 57 376 86 Q367 113 391 99',
  'M391 99 C403 70 426 19 419 16 C409 12 396 66 393 93 C410 57 432 60 425 81 L422 95 Q420 111 442 99',
  'M473 107 Q485 61 498 24 M478 36 C468 25 506 11 526 31 C558 63 522 111 477 104',
  'M542 67 L532 94 C525 117 550 102 565 68 L555 94 Q550 111 576 98',
  'M543 50 C550 35 559 58 567 43',
  'M576 98 L586 65 L578 102 C599 61 618 59 610 86 Q602 112 627 98',
  'M666 70 C646 49 624 80 630 98 C637 116 657 94 667 69 L652 120 C643 153 614 145 627 128 C637 117 672 115 688 96',
];

export function HandwrittenName({ className = '', active = true }: { className?: string; active?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();
  const visible = active && inView;

  return (
    <svg ref={ref} viewBox='0 0 710 160' fill='none' className={`signature ${className}`} aria-hidden='true'>
      {strokes.map((d, i) => (
        <motion.path key={i} d={d} stroke='currentColor' strokeWidth='4.5' strokeLinecap='round' strokeLinejoin='round'
          initial={false}
          animate={{ pathLength: reduced || visible ? 1 : 0, opacity: reduced || visible ? 1 : 0 }}
          transition={{ pathLength: { duration: reduced ? 0 : 0.48, delay: reduced ? 0 : i * 0.14, ease: 'easeInOut' }, opacity: { duration: 0.1, delay: reduced ? 0 : i * 0.14 } }} />
      ))}
    </svg>
  );
}
