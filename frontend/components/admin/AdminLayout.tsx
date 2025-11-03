"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FiLayout,
  FiMessageCircle,
  FiMail,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi"
import { useAuth } from "@/contexts/AuthContext"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    router.push("/admin/login")
  }

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: FiLayout },
    { name: "Contacts", href: "/admin/contacts", icon: FiMail },
    { name: "Chats", href: "/admin/chats", icon: FiMessageCircle },
  ]

  return (
    <div className="min-h-screen bg-nodelo-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-nodelo-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-nodelo-200">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-nodelo-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="font-bold text-nodelo-900">Nodelo Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-nodelo-600 hover:text-nodelo-900"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-nodelo-500 text-white"
                      : "text-nodelo-700 hover:bg-nodelo-100"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="border-t border-nodelo-200 p-4">
            <div className="flex items-center gap-3 mb-3 px-2">
              <div className="w-10 h-10 bg-nodelo-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-nodelo-900 truncate">
                  {user?.name || "Admin"}
                </p>
                <p className="text-xs text-nodelo-600 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
            >
              <FiLogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-nodelo-200 h-16 flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-nodelo-600 hover:text-nodelo-900 mr-4"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-nodelo-900">
            {navigation.find((item) => item.href === pathname)?.name || "Dashboard"}
          </h1>
        </header>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}

