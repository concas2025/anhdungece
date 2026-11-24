'use client';

import * as React from 'react';
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { LiquidGlass } from '@/components/ui/glass-player-utils/liquid-glass';

export function clampUnit(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00';
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function Scrubber({
  value,
  onChange,
  label,
  className,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const safeValue = clampUnit(value);

  const setFromClientX = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r || r.width <= 0) return;
    onChange(clampUnit((clientX - r.left) / r.width));
  };

  return (
    <div
      ref={ref}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(safeValue * 100)}
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => e.buttons === 1 && setFromClientX(e.clientX)}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') onChange(clampUnit(safeValue + 0.05));
        if (e.key === 'ArrowLeft') onChange(clampUnit(safeValue - 0.05));
      }}
      className={cn(
        'group/scrub relative flex h-4 cursor-pointer touch-none items-center outline-none',
        className,
      )}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-current/15 transition-[height] duration-200 group-hover/scrub:h-2.5 group-active/scrub:h-2.5 group-focus-visible/scrub:ring-2 group-focus-visible/scrub:ring-ring">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-current opacity-80"
          style={{ width: `${safeValue * 100}%` }}
        />
      </div>
    </div>
  );
}

export interface GlassPlayerProps
  extends Omit<
    React.ComponentProps<typeof LiquidGlass>,
    'title' | 'onVolumeChange'
  > {
  title: string;
  artist: string;
  /** Image URL or any node (e.g. a gradient div). */
  artwork?: React.ReactNode;
  playing: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted?: boolean;
  onTogglePlay: () => void;
  onSeek: (nextTimeSeconds: number) => void;
  onVolumeChange: (nextVolume: number) => void;
  onToggleMute?: () => void;
  onPrev: () => void;
  onNext: () => void;
  prevLabel?: string;
  nextLabel?: string;
  headerAction?: React.ReactNode;
}

function GlassPlayer({
  className,
  title,
  artist,
  artwork,
  playing,
  currentTime,
  duration,
  volume,
  muted = false,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onToggleMute,
  onPrev,
  onNext,
  prevLabel = 'Tua lùi 10 giây',
  nextLabel = 'Tua tới 10 giây',
  headerAction,
  ...props
}: GlassPlayerProps) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const safeTime =
    safeDuration > 0 && Number.isFinite(currentTime)
      ? Math.min(safeDuration, Math.max(0, currentTime))
      : 0;
  const progress = safeDuration > 0 ? clampUnit(safeTime / safeDuration) : 0;
  const effectiveVolume = muted ? 0 : clampUnit(volume);

  return (
    <LiquidGlass
      data-slot="glass-player"
      variant="frosted"
      className={cn(
        'flex w-full max-w-sm flex-col gap-4 rounded-[32px] p-5 text-(--glass-foreground)',
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'size-16 shrink-0 overflow-hidden rounded-2xl shadow-[0_8px_20px_-6px_rgb(0_0_0/0.35)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] [&>*]:size-full [&>img]:object-cover',
            !playing && 'scale-90',
          )}
        >
          {typeof artwork === 'string' ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={artwork} alt={`Ảnh bìa ${title}`} />
          ) : (
            (artwork ?? (
              <div className="bg-[conic-gradient(from_200deg,#ff6b9a,#ffb56b,#6bd2ff,#a36bff,#ff6b9a)]" />
            ))
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[17px] font-semibold tracking-[-0.02em]">
            {title}
          </div>
          <div className="truncate text-[15px] opacity-60">{artist}</div>
        </div>
        {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
      </div>

      <div className="flex flex-col gap-1">
        <Scrubber
          value={progress}
          onChange={(ratio) => onSeek(ratio * safeDuration)}
          label="Tua thời lượng bài hát"
        />
        <div className="flex justify-between text-[11px] font-medium tabular-nums opacity-55">
          <span>{formatDuration(safeTime)}</span>
          <span>-{formatDuration(Math.max(0, safeDuration - safeTime))}</span>
        </div>
      </div>

      <div className="flex items-center justify-center gap-8 [&_button]:grid [&_button]:cursor-pointer [&_button]:place-items-center [&_button]:rounded-full [&_button]:transition-[transform,background-color] [&_button]:duration-200 [&_button]:outline-none [&_button]:active:scale-85 [&_button]:focus-visible:ring-[3px] [&_button]:focus-visible:ring-ring/40">
        <button
          type="button"
          aria-label={prevLabel}
          title={prevLabel}
          className="size-11 hover:bg-(--glass-highlight)"
          onClick={onPrev}
        >
          <SkipBack className="size-6 fill-current" strokeWidth={1.6} aria-hidden="true" />
        </button>
        <button
          type="button"
          aria-label={playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          className="size-14 hover:bg-(--glass-highlight)"
          onClick={onTogglePlay}
        >
          {playing ? (
            <Pause className="size-8 fill-current" strokeWidth={0} aria-hidden="true" />
          ) : (
            <Play
              className="size-8 translate-x-[1px] fill-current"
              strokeWidth={0}
              aria-hidden="true"
            />
          )}
        </button>
        <button
          type="button"
          aria-label={nextLabel}
          title={nextLabel}
          className="size-11 hover:bg-(--glass-highlight)"
          onClick={onNext}
        >
          <SkipForward className="size-6 fill-current" strokeWidth={1.6} aria-hidden="true" />
        </button>
      </div>

      <div className="flex items-center gap-3 [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:opacity-65">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={effectiveVolume === 0 ? 'Bật tiếng' : 'Tắt tiếng'}
          className="grid size-7 cursor-pointer place-items-center rounded-full transition-colors hover:bg-(--glass-highlight)"
        >
          {effectiveVolume === 0 ? (
            <VolumeX aria-hidden="true" />
          ) : (
            <Volume1 aria-hidden="true" />
          )}
        </button>
        <Scrubber
          value={effectiveVolume}
          onChange={onVolumeChange}
          label="Âm lượng"
          className="flex-1"
        />
        <Volume2 aria-hidden="true" />
      </div>
    </LiquidGlass>
  );
}

export { GlassPlayer };
export default GlassPlayer;
