"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Logo from "./Logo"
import NavMobileMenu from "./NavMobileMenu"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/"
    }
    return pathname?.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-nodelo-100 shadow-sm">
      <nav className="container-nodelo py-4" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo and wordmark */}
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="transition-transform group-hover:scale-105" />
            <span className="text-xl font-bold text-nodelo-900">Nodelo</span>
          </Link>

          {/* Desktop navigation */}
          <ul className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-nodelo-400 focus:ring-offset-2 ${
                      active
                        ? "text-nodelo-500 bg-nodelo-100"
                        : "text-text hover:text-nodelo-500 hover:bg-nodelo-50"
                    }`}
                    aria-current={active ? "page" : undefined}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-nodelo-500 rounded-full" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-nodelo-900 focus:outline-none focus:ring-2 focus:ring-nodelo-400 rounded"
            aria-label="Toggle mobile menu"
            aria-expanded={mobileMenuOpen}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <NavMobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navLinks={navLinks}
        pathname={pathname}
      />
    </header>
  )
}
