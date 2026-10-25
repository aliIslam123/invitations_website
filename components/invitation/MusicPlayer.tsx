'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music as MusicIcon,
  SkipForward,
  SkipBack,
  ListMusic,
  X,
  ChevronDown,
} from 'lucide-react'
import { ThemeConfig } from '@/lib/themes'
import { WEDDING_MUSIC_PRESETS, MusicTrack } from '@/lib/musicPresets'

interface MusicPlayerProps {
  musicUrl?: string | null
  musicTitle?: string | null
  musicStart?: number | null
  musicEnd?: number | null
  musicTrimEnabled?: boolean
  theme: ThemeConfig
  position?: string
  isRtl?: boolean
  autoStartTrigger?: boolean
}

export function MusicPlayer({
  musicUrl,
  musicTitle,
  musicStart,
  musicEnd,
  musicTrimEnabled = false,
  theme,
  position = 'bottom-right',
  isRtl = true,
  autoStartTrigger = false,
}: MusicPlayerProps) {
  // Built-in playlist initialized with the invitation's main track, followed by curated presets
  const initialPlaylist = React.useMemo<MusicTrack[]>(() => {
    const list: MusicTrack[] = []
    if (musicUrl) {
      list.push({
        id: 'current-track',
        title: musicTitle || 'Wedding Music',
        titleAr: musicTitle || 'موسيقى الزفاف الملكية',
        artist: 'لحن الزفاف المختار',
        url: musicUrl,
        genre: 'classical',
      })
    }
    // Add presets that are not identical in URL
    for (const preset of WEDDING_MUSIC_PRESETS) {
      if (preset.url !== musicUrl) {
        list.push(preset)
      }
    }
    return list
  }, [musicUrl, musicTitle])

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.85)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const activeTrack = initialPlaylist[currentTrackIndex] || initialPlaylist[0]

  // Reset to track 0 if the primary musicUrl changes
  useEffect(() => {
    setCurrentTrackIndex(0)
  }, [musicUrl])

  // Reload audio source when activeTrack changes
  useEffect(() => {
    if (audioRef.current && activeTrack?.url) {
      // Check if src needs updating (resolving relative URLs like /uploads/...)
      const currentSrc = audioRef.current.currentSrc || audioRef.current.src
      if (!currentSrc.includes(activeTrack.url)) {
        audioRef.current.src = activeTrack.url
        audioRef.current.load()
      }
    }
  }, [activeTrack?.url])

  // Play audio safely with catch for browser policies
  const playAudio = useCallback(() => {
    if (!audioRef.current) return
    if (musicTrimEnabled && currentTrackIndex === 0 && typeof musicStart === 'number' && musicStart > 0) {
      const cur = audioRef.current.currentTime
      if (cur < musicStart || (typeof musicEnd === 'number' && musicEnd > musicStart && cur >= musicEnd)) {
        audioRef.current.currentTime = musicStart
      }
    }
    audioRef.current
      .play()
      .then(() => {
        setIsPlaying(true)
        setHasInteracted(true)
      })
      .catch((err) => {
        console.warn('Audio play prevented by browser policy:', err)
        setIsPlaying(false)
      })
  }, [musicTrimEnabled, musicStart, musicEnd, currentTrackIndex])

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    if (musicTrimEnabled && currentTrackIndex === 0) {
      const cur = audioRef.current.currentTime
      const start = typeof musicStart === 'number' && musicStart >= 0 ? musicStart : 0
      const end = typeof musicEnd === 'number' && musicEnd > start ? musicEnd : null

      if (end && cur >= end) {
        audioRef.current.currentTime = start
      } else if (cur < start - 0.5) {
        audioRef.current.currentTime = start
      }
    }
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    if (musicTrimEnabled && currentTrackIndex === 0 && typeof musicStart === 'number' && musicStart > 0) {
      audioRef.current.currentTime = musicStart
    }
  }

  // Auto-start trigger when visitor clicks "Open Invitation"
  useEffect(() => {
    if (autoStartTrigger && !hasInteracted && audioRef.current && activeTrack?.url) {
      const currentSrc = audioRef.current.currentSrc || audioRef.current.src
      if (!currentSrc.includes(activeTrack.url)) {
        audioRef.current.src = activeTrack.url
        audioRef.current.load()
      }
      playAudio()
    }
  }, [autoStartTrigger, hasInteracted, playAudio, activeTrack?.url])

  // Track switching
  const handleSelectTrack = (index: number) => {
    setCurrentTrackIndex(index)
    setShowPlaylist(false)
    // Wait for state to change and start new track
    setTimeout(() => {
      if (audioRef.current) {
        const start = musicTrimEnabled && index === 0 && typeof musicStart === 'number' ? musicStart : 0
        audioRef.current.currentTime = start
        playAudio()
      }
    }, 100)
  }

  const handleNextTrack = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextIdx = (currentTrackIndex + 1) % initialPlaylist.length
    handleSelectTrack(nextIdx)
  }

  const handlePrevTrack = (e: React.MouseEvent) => {
    e.stopPropagation()
    const prevIdx =
      (currentTrackIndex - 1 + initialPlaylist.length) % initialPlaylist.length
    handleSelectTrack(prevIdx)
  }

  const togglePlay = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      playAudio()
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!audioRef.current) return
    const nextMuted = !isMuted
    audioRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (audioRef.current) {
      audioRef.current.volume = val
      if (val === 0) {
        setIsMuted(true)
      } else if (isMuted) {
        setIsMuted(false)
      }
    }
  }

  if (!activeTrack) {
    return null
  }

  const positionClasses =
    position === 'bottom-left'
      ? 'bottom-6 left-6'
      : position === 'top-right'
      ? 'top-6 right-6'
      : 'bottom-6 right-6'

  return (
    <div className={`fixed z-40 ${positionClasses}`}>
      <audio
        ref={audioRef}
        src={activeTrack.url}
        loop
        preload="auto"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => {
          if (musicTrimEnabled && currentTrackIndex === 0) {
            if (audioRef.current) {
              audioRef.current.currentTime = musicStart || 0
              audioRef.current.play().catch(() => {})
            }
          } else {
            setIsPlaying(false)
          }
        }}
      />

      {/* Main floating pill */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        className="flex items-center gap-2 p-1.5 md:p-2 rounded-full shadow-2xl border backdrop-blur-md transition-all duration-300"
        style={{
          backgroundColor: `${theme.colors.surface}F2`,
          borderColor: theme.colors.primary,
          boxShadow: `0 12px 30px -5px ${theme.colors.secondary}40`,
        }}
      >
        {/* Play / Pause circular button */}
        <button
          type="button"
          onClick={togglePlay}
          className="w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white shrink-0 shadow-md transition-transform hover:scale-108 active:scale-95 cursor-pointer"
          style={{ backgroundColor: theme.colors.primary }}
          title={isPlaying ? (isRtl ? 'إيقاف مؤقت' : 'Pause') : (isRtl ? 'تشغيل الموسيقى' : 'Play Music')}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Track info & visualizer */}
        <div
          onClick={() => setShowPlaylist(!showPlaylist)}
          className="hidden sm:flex flex-col pr-1 pl-1 max-w-[150px] text-right cursor-pointer group"
          title={isRtl ? 'اضغط لتغيير الأغنية' : 'Click to change song'}
        >
          <div className="flex items-center gap-1">
            <span
              className="text-[11px] font-medium truncate group-hover:underline"
              style={{ color: theme.colors.text }}
            >
              {isRtl ? activeTrack.titleAr : activeTrack.title}
            </span>
            <ChevronDown className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Sound waves animation */}
          {isPlaying ? (
            <div className="flex items-center gap-0.5 mt-0.5 h-2.5">
              <span className="w-0.5 h-1.5 animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
              <span className="w-0.5 h-3 animate-ping" style={{ backgroundColor: theme.colors.primary }} />
              <span className="w-0.5 h-1 animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
              <span className="w-0.5 h-2.5 animate-pulse" style={{ backgroundColor: theme.colors.primary }} />
            </div>
          ) : (
            <span className="text-[9px] opacity-60" style={{ color: theme.colors.textLight }}>
              {isRtl ? 'موسيقى الزفاف' : 'Wedding Music'}
            </span>
          )}
        </div>

        {/* Previous Track button */}
        <button
          type="button"
          onClick={handlePrevTrack}
          className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 transition-colors cursor-pointer"
          style={{ color: theme.colors.textLight }}
          title={isRtl ? 'الأغنية السابقة' : 'Previous Song'}
          aria-label="Previous Track"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Next Track button */}
        <button
          type="button"
          onClick={handleNextTrack}
          className="p-1.5 rounded-full hover:bg-black/5 text-gray-500 transition-colors cursor-pointer"
          style={{ color: theme.colors.textLight }}
          title={isRtl ? 'الأغنية التالية' : 'Next Song'}
          aria-label="Next Track"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Playlist Toggle */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setShowPlaylist(!showPlaylist)
          }}
          className={`p-1.5 rounded-full transition-colors cursor-pointer ${
            showPlaylist ? 'bg-black/10' : 'hover:bg-black/5'
          }`}
          style={{ color: theme.colors.primary }}
          title={isRtl ? 'قائمة الموسيقى المتاحة' : 'Music Playlist'}
          aria-label="Playlist"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Mute toggle button */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          style={{ color: theme.colors.textLight }}
          title={isMuted ? (isRtl ? 'إلغاء الكتم' : 'Unmute') : (isRtl ? 'كتم الصوت' : 'Mute')}
          aria-label="Mute Toggle"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </motion.div>

      {/* Playlist Popover Modal */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-16 right-0 w-72 md:w-80 rounded-xl shadow-2xl border backdrop-blur-md overflow-hidden z-50 p-3"
            style={{
              backgroundColor: `${theme.colors.surface}FA`,
              borderColor: `${theme.colors.primary}60`,
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: `${theme.colors.primary}20` }}>
              <div className="flex items-center gap-1.5">
                <MusicIcon className="w-4 h-4" style={{ color: theme.colors.primary }} />
                <span className="text-xs font-semibold" style={{ color: theme.colors.text }}>
                  {isRtl ? 'اختر موسيقى الزفاف' : 'Choose Wedding Song'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowPlaylist(false)}
                className="p-1 rounded-full hover:bg-black/5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Track list */}
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {initialPlaylist.map((track, idx) => {
                const isSelected = idx === currentTrackIndex
                return (
                  <button
                    key={track.id || idx}
                    type="button"
                    onClick={() => handleSelectTrack(idx)}
                    className={`w-full text-right p-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? 'font-bold shadow-xs'
                        : 'hover:bg-black/5'
                    }`}
                    style={{
                      backgroundColor: isSelected ? `${theme.colors.primary}20` : 'transparent',
                      color: isSelected ? theme.colors.primary : theme.colors.text,
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-mono"
                        style={{
                          backgroundColor: isSelected ? theme.colors.primary : `${theme.colors.primary}30`,
                          color: isSelected ? '#FFFFFF' : theme.colors.text,
                        }}
                      >
                        {idx + 1}
                      </span>
                      <div className="truncate text-right">
                        <p className="truncate">{isRtl ? track.titleAr : track.title}</p>
                        <p className="text-[10px] opacity-60 truncate">{track.artist}</p>
                      </div>
                    </div>

                    {isSelected && isPlaying && (
                      <span className="w-2 h-2 rounded-full animate-ping shrink-0" style={{ backgroundColor: theme.colors.primary }} />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Volume Slider */}
            <div className="mt-3 pt-2 border-t flex items-center gap-2" style={{ borderColor: `${theme.colors.primary}20` }}>
              <Volume2 className="w-3.5 h-3.5 shrink-0 opacity-70" style={{ color: theme.colors.text }} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-[#C8A96B] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] font-mono opacity-70" style={{ color: theme.colors.text }}>
                {Math.round(volume * 100)}%
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
