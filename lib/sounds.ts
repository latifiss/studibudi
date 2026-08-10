// lib/sounds.ts
class SoundManager {
  private static instance: SoundManager
  private sounds: Map<string, HTMLAudioElement> = new Map()

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  loadSound(name: string, src: string) {
    const audio = new Audio(src)
    this.sounds.set(name, audio)
    return audio
  }

  play(name: string) {
    const sound = this.sounds.get(name)
    if (sound) {
      // Reset and play for overlapping sounds
      sound.currentTime = 0
      sound.play().catch(() => {
        // Autoplay might be blocked, handle gracefully
        console.log('Sound playback failed')
      })
    }
  }

  preload(sounds: { name: string; src: string }[]) {
    sounds.forEach(({ name, src }) => {
      this.loadSound(name, src)
    })
  }
}

export const soundManager = SoundManager.getInstance()