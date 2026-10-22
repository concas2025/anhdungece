'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { createLiquidMetal } from './liquid-metal-renderer';

export function LiquidMetalButton({ children, onClick, enabled = true }: { children: React.ReactNode; onClick?: () => void; enabled?: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || !stage.current || !canvas.current || !button.current) return;
    const root = stage.current;
    const surface = canvas.current;
    let dispose: (() => void) | undefined;
    const onLost = (event: Event) => { event.preventDefault(); dispose?.(); dispose = undefined; setFailed(true); };
    try {
      if (!surface.getContext('webgl2', { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' })) { setFailed(true); return; }
      dispose = createLiquidMetal(surface, root, button.current);
    } catch (error) { console.error('Liquid metal renderer:', error); setFailed(true); }
    surface.addEventListener('webglcontextlost', onLost);
    return () => { dispose?.(); surface.removeEventListener('webglcontextlost', onLost); };
  }, [enabled]);
  return (
    <div className={`liquid-metal ${failed ? 'liquid-metal--fallback' : ''}`}>
      <div className='liquid-metal__stage' ref={stage}>
      <div className='liquid-metal__plate' aria-hidden='true' />
      <canvas ref={canvas} aria-hidden='true' className='liquid-metal__canvas' />
      <button ref={button} type='button' onClick={onClick} className='liquid-metal__button'>
        {children}<ArrowUpRight size={18} aria-hidden='true' />
      </button>
      </div>
    </div>
  );
}
