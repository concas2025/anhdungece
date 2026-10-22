'use client';
import { useEffect, useState } from 'react';
import HoloChromeFlow from './holo-chrome-flow';
export default function ChromeBackground() {
  const [small, setSmall] = useState(true);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 767px), (pointer: coarse)');
    const update = () => setSmall(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return <div className='chrome-background' aria-hidden='true'><HoloChromeFlow preset='noir' speed={small ? 0.22 : 0.32} flow={0.8} scale={0.85} ridges={0.55} sparkle={0.25} grain={0.2} tilt={0.5} smear={0.3} iridescence={0.7} maxDpr={small ? 0.65 : 1} interactive={!small} /><div className='background-scrim' /></div>;
}
