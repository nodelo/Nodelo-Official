import Link from "next/link"
import Logo from "./Logo"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-nodelo-900 text-white py-12">
      <div className="container-nodelo">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Logo and tagline */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo variant="mono" className="text-nodelo-500" />
              <span className="text-xl font-bold">Nodelo</span>
            </div>
            <p className="text-nodelo-100 text-sm">Build product-grade apps. Fast.</p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-nodelo-100 hover:text-nodelo-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-nodelo-100 hover:text-nodelo-500 transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-nodelo-100 hover:text-nodelo-500 transition-colors text-sm">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-nodelo-100 hover:text-nodelo-500 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-nodelo-100 hover:text-nodelo-500 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-nodelo-100 hover:text-nodelo-500 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-nodelo-800 pt-8">
          <p className="text-nodelo-100 text-sm text-center">© {currentYear} Nodelo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
