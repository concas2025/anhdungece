'use client';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Icons } from '@/components/icons';
import { BioProfileData } from '../types';

export function ProfileHeader({ profile }: { profile: BioProfileData }) {
  const getInitials = (name: string) => name.split(' ').map((n) => n[0]).slice(-2).join('').toUpperCase();

  return (
    <header className='flex flex-col items-center text-center space-y-4 pt-2'>
      <div className='relative group'>
        <div className='relative rounded-full p-1 bg-gradient-to-tr from-primary/80 via-primary/30 to-transparent shadow-lg'>
          <Avatar className='h-24 w-24 sm:h-28 sm:w-28 border-2 border-background shadow-md'>
            <AvatarImage src={profile.avatarUrl} alt={profile.name} className='object-cover' />
            <AvatarFallback className='text-lg font-bold bg-muted text-foreground'>{getInitials(profile.name)}</AvatarFallback>
          </Avatar>
        </div>
        {profile.status === 'online' && (
          <span className='absolute bottom-1 right-1 flex h-4 w-4' title={profile.statusText}>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background'></span>
          </span>
        )}
      </div>

      <div className='space-y-1.5 px-2'>
        <div className='flex items-center justify-center gap-1.5'>
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight text-foreground'>{profile.name}</h1>
          {profile.isVerified && <Icons.badgeCheck className='h-5 w-5 text-primary shrink-0' title='Verified Profile' />}
        </div>
        <p className='text-sm sm:text-base font-medium text-primary/90'>{profile.title}</p>
        <p className='text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed'>{profile.bio}</p>
      </div>

      <div className='flex flex-wrap items-center justify-center gap-2 pt-1'>
        <Badge variant='outline' className='bg-background/60 backdrop-blur-sm gap-1.5 py-1 px-3'>
          <span className='size-2 rounded-full bg-emerald-500' />
          <span>{profile.statusText}</span>
        </Badge>
        <Badge variant='secondary' className='gap-1 py-1 px-2.5 text-xs text-muted-foreground'>
          <Icons.settings className='h-3 w-3' />
          <span>{profile.location}</span>
        </Badge>
      </div>

      {profile.skills.length > 0 && (
        <div className='flex flex-wrap items-center justify-center gap-1.5 pt-1 max-w-md'>
          {profile.skills.map((skill) => (
            <Badge key={skill} variant='outline' className='text-[11px] font-normal border-border/60 bg-muted/40 text-muted-foreground hover:bg-muted/80 transition-colors'>
              {skill}
            </Badge>
          ))}
        </div>
      )}
    </header>
  );
}
