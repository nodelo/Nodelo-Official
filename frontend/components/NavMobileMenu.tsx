"use client"

import { useEffect } from "react"
import Link from "next/link"

interface NavMobileMenuProps {
  isOpen: boolean
  onClose: () => void
  navLinks: { href: string; label: string }[]
  pathname: string | null
}

export default function NavMobileMenu({ isOpen, onClose, navLinks, pathname }: NavMobileMenuProps) {
  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[role="dialog"]') && !target.closest('button[aria-label="Toggle mobile menu"]')) {
        onClose()
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [isOpen, onClose])

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile menu */}
      <div
        className="md:hidden fixed inset-x-0 top-[73px] bg-white border-b border-nodelo-200 shadow-xl z-50"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <nav className="container-nodelo py-6">
          <ul className="flex flex-col gap-2">
            {navLinks.map((link, index) => {
              const active = isActive(link.href)
              return (
                <li
                  key={link.href}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nodelo-400 focus:ring-offset-2 ${
                      active
                        ? "text-nodelo-500 bg-nodelo-100 border-l-4 border-nodelo-500"
                        : "text-nodelo-900 hover:text-nodelo-500 hover:bg-nodelo-50"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}
