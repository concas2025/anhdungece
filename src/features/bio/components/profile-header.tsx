'use client';

import { MapPin, ArrowUpRight, Cpu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HandwrittenName } from '@/components/effects/handwritten-name';
import { TextReveal } from '@/components/effects/text-reveal';
import { LiquidMetalButton } from '@/components/effects/liquid-metal-button';
import { BioProfileData } from '../types';

export function ProfileHeader({ profile, ready }: { profile: BioProfileData; ready: boolean }) {
  return (
    <div className='profile-grid'>
      <div className='profile-copy'>
        <p className='profile-greeting'>Xin chào, mình là</p>
        <h1 id='profile-name' tabIndex={-1}><span className='sr-only'>{profile.name}</span><HandwrittenName active={ready} /></h1>
        <p className='profile-profession'><span>ENGINEERING</span><span className='profession-divider' />CURIOSITY<span className='profession-divider' />CONNECTION</p>
        <TextReveal text={profile.bio} active={ready} className='profile-bio' />
        <div className='profile-actions'><LiquidMetalButton enabled={ready} onClick={() => document.getElementById('ket-noi')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })}>Kết nối với mình</LiquidMetalButton><span className='profile-location'><MapPin size={14} aria-hidden='true' />{profile.location}</span></div>
      </div>
      <div className='profile-card glass-panel'>
        <div className='profile-card-top'><span>THE PERSON BEHIND THE LINKS</span><ArrowUpRight size={16} aria-hidden='true' /></div>
        <div className='avatar-orbit'><div className='orbit-line' aria-hidden='true' /><Avatar className='profile-avatar'><AvatarImage src={profile.avatarUrl} alt={'Ảnh đại diện ' + profile.name} /><AvatarFallback>AD</AvatarFallback></Avatar><span className='orbit-badge' aria-hidden='true'><Cpu size={21} strokeWidth={1.4} /></span></div>
        <div className='profile-card-info'><strong>{profile.name}</strong><p>{profile.title}</p></div>
        <div className='profile-skills'>{profile.skills.map(skill => <span key={skill}>{skill}</span>)}</div>
        <div className='profile-card-bottom'><span className='status-dot' /><span>Sẵn sàng kết nối</span><span className='profile-id'>ID / AD.01</span></div>
      </div>
    </div>
  );
}
