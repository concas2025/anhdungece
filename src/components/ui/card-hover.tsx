'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/components/ui/glass-player';
import { MusicTrack } from '@/features/bio/data/links-data';

function InlineNoise({
  children,
  opacity = 0.14,
  className,
}: {
  children: React.ReactNode;
  opacity?: number;
  className?: string;
}) {
  const noiseId = React.useId().replace(/:/g, '');

  return (
    <div className={cn('relative size-full overflow-hidden', className)}>
      <svg
        className="pointer-events-none absolute inset-0 isolate z-10 size-full"
        width="100%"
        height="100%"
        style={{ opacity }}
        aria-hidden="true"
      >
        <filter id={noiseId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="1"
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
      </svg>
      {children}
    </div>
  );
}

export interface CardHoverProps {
  tracks: MusicTrack[];
  activeIndex: number;
  playing: boolean;
  activeDuration: number;
  onSelectTrack: (index: number) => void;
  className?: string;
}

export function CardHover({
  tracks,
  activeIndex,
  playing,
  activeDuration,
  onSelectTrack,
  className,
}: CardHoverProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const expandedIndex = hoveredIndex ?? activeIndex;
  const displayedTrack = tracks[expandedIndex] ?? tracks[0];

  if (!displayedTrack) return null;

  const displayedIsActive = expandedIndex === activeIndex;
  const displayedIsPlaying = displayedIsActive && playing;
  const displayedDuration = displayedIsActive
    ? activeDuration
    : displayedTrack.fallbackDuration;

  return (
    <div
      className={cn('card-hover', className)}
      role="region"
      aria-label="Chọn bài hát theo banner"
    >
      <div
        className="card-hover-strip"
        onMouseLeave={() => setHoveredIndex(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setHoveredIndex(null);
        }}
      >
        {tracks.map((item, idx) => {
          const isActive = idx === activeIndex;
          const isPlaying = isActive && playing;
          const isExpanded = idx === expandedIndex;

          return (
            <button
              key={item.id}
              type="button"
              data-expanded={isExpanded}
              aria-pressed={isActive}
              aria-label={`${item.title} — ${item.artist}`}
              className="card-hover-card"
              onMouseEnter={() => setHoveredIndex(idx)}
              onFocus={() => setHoveredIndex(idx)}
              onClick={() => onSelectTrack(idx)}
            >
              <InlineNoise>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.artwork}
                  alt={`Banner ${item.title}`}
                  className="size-full object-cover"
                />
              </InlineNoise>
              <span className="card-hover-badge" aria-hidden="true">
                {isPlaying ? (
                  <span className="eq-bars eq-bars--active">
                    <span />
                    <span />
                    <span />
                  </span>
                ) : (
                  String(idx + 1).padStart(2, '0')
                )}
              </span>
            </button>
          );
        })}
      </div>

      <div className="card-hover-caption" aria-live="polite">
        <span className="card-hover-caption__index">
          {displayedIsPlaying ? (
            <span className="eq-bars eq-bars--active" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          ) : (
            String(expandedIndex + 1).padStart(2, '0')
          )}
        </span>
        <span className="card-hover-caption__meta">
          <strong>{displayedTrack.title}</strong>
          <span>{displayedTrack.artist}</span>
        </span>
        <span className="card-hover-caption__duration">
          {formatDuration(displayedDuration)}
        </span>
      </div>
    </div>
  );
}

export default CardHover;
