import React from "react"
import Image from "next/image"

interface AvatarProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 32, className }) => (
  <Image
    src={src}
    alt={alt}
    width={size}
    height={size}
    className={`rounded-full ${className}`}
  />
)