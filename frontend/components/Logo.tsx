import Image from "next/image"

interface LogoProps {
  className?: string
  priority?: boolean
  size?: number
}

export default function Logo({ className = "", priority = false, size = 32 }: LogoProps) {
  return (
    <Image
      src="/logo3.png"
      alt="Nodelo logo"
      width={size}
      height={size}
      className={className}
      priority={priority}
    />
  )
}
