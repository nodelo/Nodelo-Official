"use client"

import { useState, useEffect } from "react"
import ProtectedRoute from "@/components/admin/ProtectedRoute"
import AdminLayout from "@/components/admin/AdminLayout"
import { motion } from "framer-motion"
import {
  FiMail,
  FiPhone,
  FiCalendar,
  FiTrash2,
  FiEdit3,
  FiMessageCircle,
  FiSearch,
  FiX,
  FiCheck,
} from "react-icons/fi"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Contact {
  _id: string
  name: string
  email: string
  company?: string
  projectType?: string
  budget?: string
  message: string
  status: "new" | "replied" | "archived"
  createdAt: string
  updatedAt: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    fetchContacts()
  }, [])

  useEffect(() => {
    filterContacts()
  }, [contacts, selectedStatus, searchQuery])

  const fetchContacts = async () => {
    try {
      setIsLoading(true)
      const response = await api.get("/api/contacts")
      
      if (response.success && response.data) {
        setContacts(response.data)
      }
    } catch (error) {
      console.error("Error fetching contacts:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterContacts = () => {
    let filtered = [...contacts]

    // Filter by status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((contact) => contact.status === selectedStatus)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(query) ||
          contact.email.toLowerCase().includes(query) ||
          contact.message.toLowerCase().includes(query) ||
          (contact.company && contact.company.toLowerCase().includes(query))
      )
    }

    setFilteredContacts(filtered)
  }

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    try {
      const response = await api.patch(`/api/contacts/${contactId}`, {
        status: newStatus,
      })

      if (response.success) {
        setContacts((prev) =>
          prev.map((contact) =>
            contact._id === contactId ? { ...contact, status: newStatus as any } : contact
          )
        )
      }
    } catch (error) {
      console.error("Error updating contact status:", error)
    }
  }

  const handleDelete = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) {
      return
    }

    try {
      setIsDeleting(contactId)
      const response = await api.delete(`/api/contacts/${contactId}`)

      if (response.success) {
        setContacts((prev) => prev.filter((contact) => contact._id !== contactId))
        if (selectedContact?._id === contactId) {
          setSelectedContact(null)
        }
      }
    } catch (error) {
      console.error("Error deleting contact:", error)
    } finally {
      setIsDeleting(null)
    }
  }

  const handleReply = async (contact: Contact) => {
    // Reply via email (navigate to email reply functionality)
    window.location.href = `/admin/chats?contactId=${contact._id}&reply=true`
  }

  const handleStartChat = async (contact: Contact) => {
    try {
      // Create chat from contact
      const response = await api.post("/api/chats/from-contact", {
        contactId: contact._id,
      })

      if (response.success && response.data) {
        // Navigate to chats with the new chat selected
        window.location.href = `/admin/chats?chatId=${response.data._id}`
      } else {
        alert(response.error || "Failed to start chat")
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      alert("Failed to start chat. Please try again.")
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      new: "bg-blue-100 text-blue-700",
      replied: "bg-green-100 text-green-700",
      archived: "bg-gray-100 text-gray-700",
    }
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles] || styles.new
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const statusCounts = {
    all: contacts.length,
    new: contacts.filter((c) => c.status === "new").length,
    replied: contacts.filter((c) => c.status === "replied").length,
    archived: contacts.filter((c) => c.status === "archived").length,
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-nodelo-900">Contacts</h1>
              <p className="text-nodelo-600 mt-1">
                Manage all contact form submissions
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-nodelo-200 p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-nodelo-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search contacts by name, email, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-nodelo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nodelo-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-nodelo-400 hover:text-nodelo-600"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {["all", "new", "replied", "archived"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedStatus === status
                        ? "bg-nodelo-500 text-white"
                        : "bg-nodelo-100 text-nodelo-700 hover:bg-nodelo-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)} (
                    {statusCounts[status as keyof typeof statusCounts]})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contacts List */}
          {isLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-nodelo-200 p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-nodelo-500"></div>
              <p className="mt-4 text-nodelo-600">Loading contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-nodelo-200 p-12 text-center">
              <FiMail className="w-12 h-12 text-nodelo-300 mx-auto mb-4" />
              <p className="text-nodelo-600">No contacts found</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-nodelo-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-nodelo-50 border-b border-nodelo-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-nodelo-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-nodelo-700 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-nodelo-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-nodelo-700 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-nodelo-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-nodelo-200">
                    {filteredContacts.map((contact) => (
                      <motion.tr
                        key={contact._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="hover:bg-nodelo-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="font-semibold text-nodelo-900">{contact.name}</div>
                            <div className="text-sm text-nodelo-600 flex items-center gap-1 mt-1">
                              <FiMail className="w-4 h-4" />
                              {contact.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-nodelo-700">
                            {contact.company && (
                              <div className="font-medium">{contact.company}</div>
                            )}
                            <div className="text-nodelo-600 mt-1 line-clamp-2 max-w-md">
                              {contact.message}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(contact.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-nodelo-600">
                          {new Date(contact.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusUpdate(contact._id, "replied")}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Mark as replied"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReply(contact)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Reply via Email"
                            >
                              <FiMail className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleStartChat(contact)}
                              className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Start Chat"
                            >
                              <FiMessageCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(contact._id)}
                              disabled={isDeleting === contact._id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              <FiTrash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

