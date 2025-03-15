"use client"

import { useEffect, useState } from "react"
import type { ReactElement } from "react"

export function Confetti() {
  const [particles, setParticles] = useState<ReactElement[]>([])

  useEffect(() => {
    const colors = [
      "#a855f7", // purple
      "#ec4899", // pink
      "#f97316", // orange
      "#6366f1", // indigo
      "#10b981", // emerald
    ]

    const newParticles: ReactElement[] = []

    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100
      const top = Math.random() * 100
      const size = Math.random() * 8 + 4
      const color = colors[Math.floor(Math.random() * colors.length)]
      const animationDuration = Math.random() * 10 + 10
      const animationDelay = Math.random() * 5

      newParticles.push(
        <div
          key={i}
          className="fixed rounded-full pointer-events-none opacity-0"
          style={{
            left: `${left}%`,
            top: `-5%`,
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            animation: `fall ${animationDuration}s ease-in ${animationDelay}s infinite`,
          }}
        />,
      )
    }

    setParticles(newParticles)

    // Add the keyframes to the document
    const style = document.createElement("style")
    style.innerHTML = `
      @keyframes fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return <>{particles}</>
}

