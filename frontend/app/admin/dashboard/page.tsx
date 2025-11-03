"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/admin/ProtectedRoute"
import AdminLayout from "@/components/admin/AdminLayout"
import { motion } from "framer-motion"
import { FiMail, FiMessageCircle, FiTrendingUp, FiUsers } from "react-icons/fi"
import api from "@/lib/api"

interface DashboardStats {
  totalContacts: number
  newContacts: number
  totalChats: number
  activeChats: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalContacts: 0,
    newContacts: 0,
    totalChats: 0,
    activeChats: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      
      // Fetch contacts
      const contactsResponse = await api.get("/api/contacts")
      const contacts = contactsResponse.success ? contactsResponse.data : []
      
      // Fetch chats
      const chatsResponse = await api.get("/api/chats")
      const chats = chatsResponse.success ? chatsResponse.data : []

      setStats({
        totalContacts: contacts.length || 0,
        newContacts: contacts.filter((c: any) => c.status === "new").length || 0,
        totalChats: chats.length || 0,
        activeChats: chats.filter((c: any) => c.status === "active").length || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: "Total Contacts",
      value: stats.totalContacts,
      icon: FiMail,
      color: "from-blue-500 to-blue-600",
      change: "+12%",
    },
    {
      title: "New Contacts",
      value: stats.newContacts,
      icon: FiUsers,
      color: "from-green-500 to-green-600",
      change: "+5",
    },
    {
      title: "Total Chats",
      value: stats.totalChats,
      icon: FiMessageCircle,
      color: "from-purple-500 to-purple-600",
      change: "+8",
    },
    {
      title: "Active Chats",
      value: stats.activeChats,
      icon: FiTrendingUp,
      color: "from-orange-500 to-orange-600",
      change: "+3",
    },
  ]

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-nodelo-500 to-nodelo-600 rounded-2xl p-6 text-white"
          >
            <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
            <p className="text-nodelo-100">
              Here's what's happening with your contacts and chats today.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-nodelo-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}
                  >
                    <card.icon className="w-6 h-6" />
                  </div>
                  <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                    {card.change}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-nodelo-600 mb-1">{card.title}</h3>
                {isLoading ? (
                  <div className="h-8 w-20 bg-nodelo-100 rounded animate-pulse" />
                ) : (
                  <p className="text-3xl font-bold text-nodelo-900">{card.value}</p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-nodelo-200 p-6"
          >
            <h3 className="text-lg font-bold text-nodelo-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href="/admin/contacts"
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-nodelo-200 hover:border-nodelo-500 hover:bg-nodelo-50 transition-all cursor-pointer"
              >
                <FiMail className="w-6 h-6 text-nodelo-500" />
                <div>
                  <p className="font-semibold text-nodelo-900">View Contacts</p>
                  <p className="text-sm text-nodelo-600">Manage all contact submissions</p>
                </div>
              </a>
              <a
                href="/admin/chats"
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-nodelo-200 hover:border-nodelo-500 hover:bg-nodelo-50 transition-all cursor-pointer"
              >
                <FiMessageCircle className="w-6 h-6 text-nodelo-500" />
                <div>
                  <p className="font-semibold text-nodelo-900">View Chats</p>
                  <p className="text-sm text-nodelo-600">Manage all conversations</p>
                </div>
              </a>
              <a
                href="/admin/contacts"
                className="flex items-center gap-3 p-4 rounded-xl border-2 border-nodelo-200 hover:border-nodelo-500 hover:bg-nodelo-50 transition-all cursor-pointer"
              >
                <FiUsers className="w-6 h-6 text-nodelo-500" />
                <div>
                  <p className="font-semibold text-nodelo-900">New Messages</p>
                  <p className="text-sm text-nodelo-600">Check unread messages</p>
                </div>
              </a>
            </div>
          </motion.div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

