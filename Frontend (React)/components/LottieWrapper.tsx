'use client'

import { useEffect, useState } from 'react'

interface LottieWrapperProps {
  src: string
  className?: string
  loop?: boolean
  autoplay?: boolean
}

export default function LottieWrapper({ src, className, loop = true, autoplay = true }: LottieWrapperProps) {
  const [Player, setPlayer] = useState<any>(null)

  useEffect(() => {
    import('@lottiefiles/react-lottie-player').then((module) => {
      setPlayer(() => module.Player)
    })
  }, [])

  if (!Player) {
    return (
      <div className={`${className} bg-white/10 rounded-lg flex items-center justify-center`}>
        <div className="text-white/50 text-sm">Loading...</div>
      </div>
    )
  }

  return (
    <Player
      src={src}
      className={className}
      loop={loop}
      autoplay={autoplay}
    />
  )
}

