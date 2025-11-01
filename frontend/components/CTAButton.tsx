"use client"

import type React from "react"

import Link from "next/link"

interface CTAButtonProps {
  href?: string
  onClick?: () => void
  variant?: "primary" | "ghost" | "secondary"
  children: React.ReactNode
  className?: string
  ariaLabel?: string
}

export default function CTAButton({
  href,
  onClick,
  variant = "primary",
  children,
  className = "",
  ariaLabel,
}: CTAButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-nodelo-400"

  const variantStyles = {
    primary: "bg-nodelo-500 text-white shadow-md hover:scale-105 hover:shadow-lg active:animate-pop",
    ghost: "bg-white text-nodelo-900 border-2 border-nodelo-900 hover:scale-105 hover:shadow-md active:animate-pop",
    secondary: "bg-nodelo-100 text-nodelo-900 border border-nodelo-400/20 hover:bg-nodelo-200 hover:scale-105 hover:shadow-md active:animate-pop",
  }

  const combinedStyles = `${baseStyles} ${variantStyles[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={combinedStyles} aria-label={ariaLabel}>
        {children}
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={combinedStyles} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
