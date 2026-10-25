import { Variants } from 'framer-motion'

export type AnimationPreset = 'subtle' | 'elegant' | 'cinematic'

export interface PresetConfig {
  name: string
  nameAr: string
  description: string
  duration: number
  stagger: number
  ease: [number, number, number, number]
}

export const ANIMATION_PRESETS: Record<AnimationPreset, PresetConfig> = {
  subtle: {
    name: 'Subtle',
    nameAr: 'هادئ وبسيط',
    description: 'Gentle, rapid opacity fades and minimal translation',
    duration: 0.5,
    stagger: 0.08,
    ease: [0.25, 0.1, 0.25, 1.0],
  },
  elegant: {
    name: 'Elegant',
    nameAr: 'أنيق وراقي',
    description: 'Smooth, graceful motion with balanced timing and gentle rises',
    duration: 0.8,
    stagger: 0.15,
    ease: [0.22, 1, 0.36, 1],
  },
  cinematic: {
    name: 'Cinematic',
    nameAr: 'سينمائي فاخر',
    description: 'Rich, atmospheric reveals, dramatic typography transitions and deeper pacing',
    duration: 1.2,
    stagger: 0.25,
    ease: [0.16, 1, 0.3, 1],
  },
}

/**
 * Generate Framer Motion variants based on chosen preset.
 */
export function getFadeUpVariants(preset: AnimationPreset = 'elegant'): Variants {
  const config = ANIMATION_PRESETS[preset] ?? ANIMATION_PRESETS.elegant
  const yOffset = preset === 'subtle' ? 15 : preset === 'elegant' ? 30 : 50

  return {
    hidden: {
      opacity: 0,
      y: yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.duration,
        ease: config.ease,
      },
    },
  }
}

export function getStaggerContainerVariants(preset: AnimationPreset = 'elegant'): Variants {
  const config = ANIMATION_PRESETS[preset] ?? ANIMATION_PRESETS.elegant

  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: config.stagger,
        delayChildren: 0.1,
      },
    },
  }
}

export function getScaleRevealVariants(preset: AnimationPreset = 'elegant'): Variants {
  const config = ANIMATION_PRESETS[preset] ?? ANIMATION_PRESETS.elegant
  const initialScale = preset === 'cinematic' ? 0.92 : 0.96

  return {
    hidden: {
      opacity: 0,
      scale: initialScale,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: config.duration * 1.1,
        ease: config.ease,
      },
    },
  }
}

export function getCoverRevealVariants(preset: AnimationPreset = 'cinematic'): Variants {
  return {
    initial: {
      opacity: 1,
      scale: 1,
    },
    opening: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(8px)',
      transition: {
        duration: 1.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }
}
