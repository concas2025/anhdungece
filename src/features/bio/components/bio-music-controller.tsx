'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ChevronDown,
  ChevronUp,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { GlassPlayer, clampUnit } from '@/components/ui/glass-player';
import { CardHover } from '@/components/ui/card-hover';
import { LiquidGlass } from '@/components/ui/glass-player-utils/liquid-glass';
import { MusicTrack } from '../data/links-data';

export function clampSeekTime(timeSeconds: number, duration: number): number {
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  if (!Number.isFinite(timeSeconds)) return 0;
  return Math.min(duration, Math.max(0, timeSeconds));
}

export function computeStepSeekTime(
  currentTime: number,
  deltaSeconds: number,
  duration: number,
): number {
  const safeCurrent = Number.isFinite(currentTime) ? currentTime : 0;
  return clampSeekTime(safeCurrent + deltaSeconds, duration);
}

export function useBioAudio(tracks: MusicTrack[]) {
  const audioRef = React.useRef<HTMLAudioElement>(null);
  const resumeNextTrackRef = React.useRef(false);

  const [trackIndex, setTrackIndex] = React.useState(0);
  const [playing, setPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(
    tracks[0]?.fallbackDuration ?? 200,
  );
  const [volume, setVolume] = React.useState(0.7);
  const [muted, setMuted] = React.useState(false);

  const track = tracks[trackIndex] ?? tracks[0];
  const hasMultipleTracks = tracks.length > 1;

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = clampUnit(volume);
    audio.muted = muted;
  }, [volume, muted]);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    setCurrentTime(0);
    setDuration(track.fallbackDuration);
    if (resumeNextTrackRef.current) {
      resumeNextTrackRef.current = false;
      audio.play().catch(() => setPlaying(false));
    }
  }, [track]);

  const togglePlay = React.useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }, []);

  const selectTrack = React.useCallback(
    (index: number) => {
      if (index < 0 || index >= tracks.length) return;
      if (index === trackIndex) {
        void togglePlay();
        return;
      }
      resumeNextTrackRef.current = true;
      setTrackIndex(index);
    },
    [tracks.length, trackIndex, togglePlay],
  );

  const seek = React.useCallback(
    (nextSeconds: number) => {
      const audio = audioRef.current;
      const effectiveDuration =
        audio && Number.isFinite(audio.duration) && audio.duration > 0
          ? audio.duration
          : duration;
      const clamped = clampSeekTime(nextSeconds, effectiveDuration);
      setCurrentTime(clamped);
      if (audio) audio.currentTime = clamped;
    },
    [duration],
  );

  const changeVolume = React.useCallback((nextVolume: number) => {
    const safe = clampUnit(nextVolume);
    setVolume(safe);
    if (safe > 0) setMuted(false);
  }, []);

  const toggleMute = React.useCallback(() => {
    setMuted((m) => !m);
  }, []);

  const prev = React.useCallback(() => {
    if (hasMultipleTracks) {
      resumeNextTrackRef.current = playing;
      setTrackIndex((i) => (i - 1 + tracks.length) % tracks.length);
      return;
    }
    seek(computeStepSeekTime(currentTime, -10, duration));
  }, [hasMultipleTracks, playing, tracks.length, seek, currentTime, duration]);

  const next = React.useCallback(() => {
    if (hasMultipleTracks) {
      resumeNextTrackRef.current = playing;
      setTrackIndex((i) => (i + 1) % tracks.length);
      return;
    }
    seek(computeStepSeekTime(currentTime, 10, duration));
  }, [hasMultipleTracks, playing, tracks.length, seek, currentTime, duration]);

  const audioElement = track ? (
    <audio
      ref={audioRef}
      src={track.src}
      preload="metadata"
      loop={!hasMultipleTracks}
      onLoadedMetadata={(e) => {
        const d = e.currentTarget.duration;
        if (Number.isFinite(d) && d > 0) setDuration(d);
      }}
      onDurationChange={(e) => {
        const d = e.currentTarget.duration;
        if (Number.isFinite(d) && d > 0) setDuration(d);
      }}
      onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onEnded={() => {
        if (hasMultipleTracks) {
          resumeNextTrackRef.current = true;
          setTrackIndex((i) => (i + 1) % tracks.length);
        } else {
          setPlaying(false);
        }
      }}
    />
  ) : null;

  return {
    tracks,
    trackIndex,
    track,
    hasMultipleTracks,
    playing,
    currentTime,
    duration,
    volume,
    muted,
    togglePlay,
    selectTrack,
    seek,
    changeVolume,
    toggleMute,
    prev,
    next,
    audioElement,
  };
}

export type BioAudioState = ReturnType<typeof useBioAudio>;

function buildPlayerProps(audio: BioAudioState) {
  return {
    title: audio.track.title,
    artist: audio.track.artist,
    artwork: audio.track.artwork,
    playing: audio.playing,
    currentTime: audio.currentTime,
    duration: audio.duration,
    volume: audio.volume,
    muted: audio.muted,
    onTogglePlay: audio.togglePlay,
    onSeek: audio.seek,
    onVolumeChange: audio.changeVolume,
    onToggleMute: audio.toggleMute,
    onPrev: audio.prev,
    onNext: audio.next,
    prevLabel: audio.hasMultipleTracks ? 'Bài trước' : 'Tua lùi 10 giây',
    nextLabel: audio.hasMultipleTracks ? 'Bài tiếp' : 'Tua tới 10 giây',
  };
}

export function BioMusicShowcase({
  audio,
  containerRef,
}: {
  audio: BioAudioState;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={containerRef}
      className="music-showcase-band glass-panel"
      aria-label="Trình phát nhạc nền"
    >
      <div className="music-showcase-copy">
        <span className="music-showcase-kicker">
          <span className="status-dot" />
          00 / SOUNDTRACK
        </span>
        <h2 className="music-showcase-title">
          Thích nghe nhạc thì bấm bên cạnh nhóoo<span>.</span>
        </h2>

        <CardHover
          tracks={audio.tracks}
          activeIndex={audio.trackIndex}
          playing={audio.playing}
          activeDuration={audio.duration}
          onSelectTrack={audio.selectTrack}
        />
      </div>

      <div className="music-showcase-player">
        <GlassPlayer {...buildPlayerProps(audio)} className="max-w-none" />
      </div>
    </div>
  );
}

export function FloatingBioMusicPlayer({
  audio,
  visible,
}: {
  audio: BioAudioState;
  visible: boolean;
}) {
  const [desktopExpanded, setDesktopExpanded] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      setDismissed(false);
      setDesktopExpanded(false);
      setMobileExpanded(false);
    }
  }, [visible]);

  React.useEffect(() => {
    if (audio.playing) setDismissed(false);
  }, [audio.playing]);

  React.useEffect(() => {
    if (!mobileExpanded && !desktopExpanded) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileExpanded(false);
        setDesktopExpanded(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileExpanded, desktopExpanded]);

  const isShown = visible && !dismissed;
  const playerProps = buildPlayerProps(audio);

  return (
    <AnimatePresence>
      {isShown ? (
        <React.Fragment key="floating-music">
          {/* Desktop (>= 1180px): Pop-up pill/card at bottom-right */}
          <motion.aside
            className="floating-player-desktop"
            aria-label="Trình phát nhạc nổi"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {desktopExpanded ? (
              <GlassPlayer
                {...playerProps}
                className="w-full max-w-[348px]"
                headerAction={
                  <button
                    type="button"
                    onClick={() => setDesktopExpanded(false)}
                    aria-label="Thu gọn trình phát nhạc"
                    title="Thu gọn"
                    className="grid size-8 cursor-pointer place-items-center rounded-full opacity-70 transition hover:bg-(--glass-highlight) hover:opacity-100"
                  >
                    <Minimize2 size={15} aria-hidden="true" />
                  </button>
                }
              />
            ) : (
              <LiquidGlass variant="frosted" className="floating-pill">
                <div className="floating-pill__cover">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={audio.track.artwork}
                    alt={`Ảnh bìa ${audio.track.title}`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setDesktopExpanded(true)}
                  aria-label="Mở rộng trình phát nhạc"
                  className="floating-pill__meta cursor-pointer border-0 bg-transparent p-0 text-left text-inherit"
                >
                  <div className="floating-pill__title">{audio.track.title}</div>
                  <div className="floating-pill__artist">{audio.track.artist}</div>
                </button>
                <button
                  type="button"
                  onClick={audio.togglePlay}
                  aria-label={audio.playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
                  className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-(--glass-highlight)"
                >
                  {audio.playing ? (
                    <Pause
                      size={16}
                      className="fill-current"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                  ) : (
                    <Play
                      size={16}
                      className="translate-x-[1px] fill-current"
                      strokeWidth={0}
                      aria-hidden="true"
                    />
                  )}
                </button>
                <button
                  type="button"
                  onClick={audio.toggleMute}
                  aria-label={
                    audio.muted || audio.volume === 0 ? 'Bật tiếng' : 'Tắt tiếng'
                  }
                  className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full opacity-75 transition hover:bg-(--glass-highlight) hover:opacity-100"
                >
                  {audio.muted || audio.volume === 0 ? (
                    <VolumeX size={15} aria-hidden="true" />
                  ) : (
                    <Volume2 size={15} aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setDesktopExpanded(true)}
                  aria-label="Mở rộng trình phát nhạc"
                  title="Mở rộng"
                  className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full opacity-75 transition hover:bg-(--glass-highlight) hover:opacity-100"
                >
                  <Maximize2 size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setDismissed(true)}
                  aria-label="Ẩn trình phát nổi"
                  title="Ẩn tạm thời"
                  className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full opacity-55 transition hover:bg-(--glass-highlight) hover:opacity-100"
                >
                  <X size={13} aria-hidden="true" />
                </button>
              </LiquidGlass>
            )}
          </motion.aside>

          {/* Mobile & Tablet (< 1180px): Mini bar stacked above .section-dock */}
          {mobileExpanded ? (
            <div
              className="mobile-music-backdrop"
              aria-hidden="true"
              onClick={() => setMobileExpanded(false)}
            />
          ) : null}

          <motion.aside
            className="mobile-music-dock"
            aria-label="Trình phát nhạc di động"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 14 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            {mobileExpanded ? (
              <GlassPlayer
                {...playerProps}
                className="w-full max-w-[410px]"
                headerAction={
                  <button
                    type="button"
                    onClick={() => setMobileExpanded(false)}
                    aria-label="Thu gọn trình phát nhạc"
                    className="grid size-8 cursor-pointer place-items-center rounded-full opacity-75 transition hover:bg-(--glass-highlight) hover:opacity-100"
                  >
                    <ChevronDown size={17} aria-hidden="true" />
                  </button>
                }
              />
            ) : null}

            <LiquidGlass variant="frosted" className="mobile-music-bar">
              <div className="mobile-music-bar__cover">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={audio.track.artwork}
                  alt={`Ảnh bìa ${audio.track.title}`}
                />
              </div>
              <button
                type="button"
                onClick={() => setMobileExpanded((open) => !open)}
                className="min-w-0 flex-1 cursor-pointer border-0 bg-transparent p-0 text-left text-inherit"
                aria-expanded={mobileExpanded}
                aria-label={
                  mobileExpanded
                    ? 'Thu gọn trình phát nhạc'
                    : 'Mở rộng trình phát nhạc'
                }
              >
                <div className="floating-pill__title">{audio.track.title}</div>
                <div className="floating-pill__artist">{audio.track.artist}</div>
              </button>
              <button
                type="button"
                onClick={audio.togglePlay}
                aria-label={audio.playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full transition hover:bg-(--glass-highlight)"
              >
                {audio.playing ? (
                  <Pause
                    size={16}
                    className="fill-current"
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                ) : (
                  <Play
                    size={16}
                    className="translate-x-[1px] fill-current"
                    strokeWidth={0}
                    aria-hidden="true"
                  />
                )}
              </button>
              <button
                type="button"
                onClick={() => setMobileExpanded((open) => !open)}
                aria-label={
                  mobileExpanded
                    ? 'Thu gọn trình phát nhạc'
                    : 'Mở rộng trình phát nhạc'
                }
                aria-expanded={mobileExpanded}
                className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full opacity-75 transition hover:bg-(--glass-highlight) hover:opacity-100"
              >
                {mobileExpanded ? (
                  <ChevronDown size={16} aria-hidden="true" />
                ) : (
                  <ChevronUp size={16} aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileExpanded(false);
                  setDismissed(true);
                }}
                aria-label="Ẩn thanh nhạc"
                title="Ẩn tạm thời"
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full opacity-55 transition hover:bg-(--glass-highlight) hover:opacity-100"
              >
                <X size={14} aria-hidden="true" />
              </button>
            </LiquidGlass>
          </motion.aside>
        </React.Fragment>
      ) : null}
    </AnimatePresence>
  );
}
