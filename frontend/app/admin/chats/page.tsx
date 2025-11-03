"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import ProtectedRoute from "@/components/admin/ProtectedRoute"
import AdminLayout from "@/components/admin/AdminLayout"
import { motion } from "framer-motion"
import {
  FiMessageCircle,
  FiSearch,
  FiSend,
  FiPaperclip,
  FiUser,
  FiClock,
  FiCheck,
  FiCheckCircle,
  FiX,
} from "react-icons/fi"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { getSocket, joinChat, leaveChat, markMessagesRead } from "@/lib/socket"

interface Message {
  _id: string
  chatId: string
  senderType: "user" | "admin"
  senderId?: string
  senderName: string
  content?: string
  attachments?: Array<{
    url: string
    type: string
    fileName: string
  }>
  isRead: boolean
  createdAt: string
}

interface Chat {
  _id: string
  userId: string
  userName: string
  userEmail: string
  adminId?: string
  adminName?: string
  status: "active" | "resolved" | "archived"
  lastMessageAt: string
  lastMessageBy: string
  unreadCount: {
    user: number
    admin: number
  }
  contactId?: string
}

export default function ChatsPage() {
  const searchParams = useSearchParams()
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isTyping, setIsTyping] = useState<{ [chatId: string]: { isTyping: boolean; userName: string } }>({})
  
  // Use ref to track selectedChat without causing re-renders
  const selectedChatRef = useRef<Chat | null>(null)
  
  // Update ref when selectedChat changes
  useEffect(() => {
    selectedChatRef.current = selectedChat
  }, [selectedChat])

  // Setup Socket.io once on mount (not dependent on selectedChat)
  useEffect(() => {
    fetchChats()

    // Setup Socket.io
    const socket = getSocket()

    // Listen for new messages
    const handleNewMessage = (message: Message) => {
      // Update messages if it's the currently selected chat (use ref to avoid stale closure)
      if (selectedChatRef.current && message.chatId === selectedChatRef.current._id) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === message._id)) {
            return prev
          }
          return [...prev, message]
        })
      }
      // Update chats list to refresh unread counts (but don't set loading state)
      setChats((prev) => {
        const updated = prev.map((chat) => {
          if (chat._id === message.chatId) {
            return {
              ...chat,
              lastMessageAt: message.createdAt,
              lastMessageBy: message.senderType,
              unreadCount: {
                ...chat.unreadCount,
                admin: message.senderType === "user" ? (chat.unreadCount.admin || 0) + 1 : chat.unreadCount.admin,
              },
            }
          }
          return chat
        })
        return updated
      })
    }

    // Listen for typing indicators
    const handleTyping = (data: { chatId: string; isTyping: boolean; userName: string }) => {
      setIsTyping((prev) => ({
        ...prev,
        [data.chatId]: { isTyping: data.isTyping, userName: data.userName },
      }))
    }

    // Listen for messages marked as read
    const handleMessagesRead = (data: { chatId: string }) => {
      // Use ref to check current selected chat
      if (selectedChatRef.current && data.chatId === selectedChatRef.current._id) {
        // Refresh messages to update read status
        fetchMessages(selectedChatRef.current._id)
      }
      // Update unread counts without full refresh
      setChats((prev) => {
        return prev.map((chat) => {
          if (chat._id === data.chatId) {
            return {
              ...chat,
              unreadCount: { ...chat.unreadCount, admin: 0 },
            }
          }
          return chat
        })
      })
    }

    socket.on("newMessage", handleNewMessage)
    socket.on("userTyping", handleTyping)
    socket.on("messagesRead", handleMessagesRead)

    return () => {
      socket.off("newMessage", handleNewMessage)
      socket.off("userTyping", handleTyping)
      socket.off("messagesRead", handleMessagesRead)
    }
  }, []) // Only run once on mount

  useEffect(() => {
    const contactId = searchParams.get("contactId")
    const chatId = searchParams.get("chatId")
    
    if (chatId) {
      // Find chat by ID
      const chat = chats.find((c) => c._id === chatId)
      if (chat && chat._id !== selectedChat?._id) {
        setSelectedChat(chat)
      }
    } else if (contactId && chats.length > 0) {
      // Find chat by contactId
      const chat = chats.find((c) => c.contactId === contactId)
      if (chat && chat._id !== selectedChat?._id) {
        setSelectedChat(chat)
      }
    }
  }, [searchParams, chats, selectedChat])

  useEffect(() => {
    if (!selectedChat) return

    // Join chat room for real-time updates
    joinChat(selectedChat._id)
    fetchMessages(selectedChat._id)
    
    // Mark as read after a short delay to avoid race conditions
    const markReadTimer = setTimeout(() => {
      markAsRead(selectedChat._id)
    }, 300)

    return () => {
      clearTimeout(markReadTimer)
      leaveChat(selectedChat._id)
    }
  }, [selectedChat?._id]) // Only depend on chat ID, not the whole object

  const fetchChats = async (showLoading: boolean = true) => {
    try {
      if (showLoading) {
        setIsLoading(true)
      }
      const response = await api.get<Chat[]>("/api/chats")

      if (response.success && response.data) {
        const chatsData = Array.isArray(response.data) ? response.data : []
        setChats(chatsData)
        
        // Auto-select first chat if none selected (only on initial load)
        if (chatsData.length > 0 && !selectedChat && showLoading) {
          setSelectedChat(chatsData[0])
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error)
    } finally {
      if (showLoading) {
        setIsLoading(false)
      }
    }
  }

  const fetchMessages = async (chatId: string) => {
    try {
      setIsLoadingMessages(true)
      const response = await api.get<{ messages: Message[] }>(`/api/chats/${chatId}`)

      if (response.success && response.data) {
        const fetchedMessages = response.data.messages || []
        // Sort by createdAt ascending (oldest first) for proper display order
        const sortedMessages = fetchedMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        setMessages(sortedMessages)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const markAsRead = async (chatId: string) => {
    try {
      // Mark via API
      await api.post("/api/chats/mark-read", { chatId })
      // Also mark via socket
      markMessagesRead(chatId, [], "admin")
      // Update unread counts without triggering loading state
      setChats((prev) => {
        return prev.map((chat) => {
          if (chat._id === chatId) {
            return {
              ...chat,
              unreadCount: { ...chat.unreadCount, admin: 0 },
            }
          }
          return chat
        })
      })
    } catch (error) {
      console.error("Error marking as read:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedChat || (!messageText.trim() && selectedFiles.length === 0)) {
      return
    }

    setIsSending(true)

    try {
      const formData = new FormData()
      formData.append("chatId", selectedChat._id)
      if (messageText.trim()) {
        formData.append("content", messageText.trim())
      }
      
      // Append files
      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })

      const response = await api.post("/api/chats/message", formData, true)

      if (response.success) {
        setMessageText("")
        setSelectedFiles([])
        // Refresh messages (Socket.io will handle real-time update)
        // Only refresh messages, not the entire chats list to avoid page refresh
        fetchMessages(selectedChat._id)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 5)) // Max 5 files
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const filteredChats = chats.filter((chat) => {
    const matchesSearch =
      chat.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      chat.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = filterStatus === "all" || chat.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <ProtectedRoute>
      <AdminLayout>
        <div className="flex h-[calc(100vh-8rem)] gap-4">
          {/* Chat List Sidebar */}
          <div className="w-80 bg-white rounded-xl shadow-sm border border-nodelo-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-nodelo-200">
              <h2 className="font-bold text-nodelo-900 mb-3">Conversations</h2>
              
              {/* Search */}
              <div className="relative mb-3">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-nodelo-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-nodelo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nodelo-500"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {["all", "active", "resolved", "archived"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-2 py-1 text-xs rounded font-medium transition-all ${
                      filterStatus === status
                        ? "bg-nodelo-500 text-white"
                        : "bg-nodelo-100 text-nodelo-700 hover:bg-nodelo-200"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-nodelo-600 text-sm">Loading chats...</div>
              ) : filteredChats.length === 0 ? (
                <div className="p-4 text-center text-nodelo-600 text-sm">No chats found</div>
              ) : (
                filteredChats.map((chat) => (
                  <motion.div
                    key={chat._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      // Only update if selecting a different chat to prevent unnecessary refreshes
                      if (selectedChat?._id !== chat._id) {
                        setSelectedChat(chat)
                      }
                    }}
                    className={`p-4 border-b border-nodelo-100 cursor-pointer transition-colors ${
                      selectedChat?._id === chat._id
                        ? "bg-nodelo-50 border-l-4 border-l-nodelo-500"
                        : "hover:bg-nodelo-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-nodelo-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {chat.userName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-nodelo-900 text-sm truncate">
                            {chat.userName}
                          </h3>
                          {chat.unreadCount.admin > 0 && (
                            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                              {chat.unreadCount.admin}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-nodelo-600 truncate">{chat.userEmail}</p>
                        <p className="text-xs text-nodelo-500 mt-1">
                          {formatTime(chat.lastMessageAt)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-nodelo-200 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-nodelo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-nodelo-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {selectedChat.userName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-nodelo-900">{selectedChat.userName}</h3>
                        <p className="text-sm text-nodelo-600">{selectedChat.userEmail}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedChat.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {selectedChat.status}
                    </span>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {isLoadingMessages ? (
                    <div className="text-center text-nodelo-600">Loading messages...</div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-nodelo-600 py-8">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    messages.map((message) => {
                      // Admin view: admin messages go right, user messages go left
                      // Normalize senderType to handle any case issues
                      const senderType = String(message.senderType || "").toLowerCase().trim()
                      const isAdminMessage = senderType === "admin"
                      const isUserMessage = senderType === "user"
                      
                      // Debug logging (remove in production)
                      if (process.env.NODE_ENV === "development") {
                        console.log("Admin Message:", {
                          id: message._id,
                          senderType: message.senderType,
                          normalized: senderType,
                          isAdmin: isAdminMessage,
                          isUser: isUserMessage,
                          senderName: message.senderName
                        })
                      }
                      
                      // Ensure correct alignment based on sender type
                      const alignRight = isAdminMessage // Admin messages on right
                      const alignLeft = isUserMessage   // User messages on left
                      
                      return (
                        <motion.div
                          key={message._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${alignRight ? "justify-end" : alignLeft ? "justify-start" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                              isAdminMessage
                                ? "bg-nodelo-500 text-white shadow-sm"
                                : "bg-nodelo-100 text-nodelo-900 border-2 border-nodelo-200 shadow-sm"
                            }`}
                          >
                            {isUserMessage && (
                              <div className="text-xs font-medium mb-1 opacity-75">
                                {message.senderName}
                              </div>
                            )}
                            {message.content && (
                              <p className={`text-sm ${isAdminMessage ? "text-white" : "text-nodelo-900"}`}>
                                {message.content}
                              </p>
                            )}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-2 space-y-2">
                                {message.attachments.map((attachment, idx) => (
                                  <a
                                    key={idx}
                                    href={attachment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block text-sm underline ${isAdminMessage ? "text-white" : "text-nodelo-600"}`}
                                  >
                                    📎 {attachment.fileName}
                                  </a>
                                ))}
                              </div>
                            )}
                            <div className={`flex items-center ${isAdminMessage ? "justify-end" : "justify-start"} gap-1 mt-1`}>
                              <span className={`text-xs ${isAdminMessage ? "opacity-75 text-white" : "opacity-60 text-nodelo-600"}`}>
                                {new Date(message.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {isAdminMessage && message.isRead && (
                                <FiCheckCircle className="w-3 h-3 opacity-75" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })
                  )}
                  {/* Typing Indicator */}
                  {selectedChat && isTyping[selectedChat._id]?.isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-nodelo-100 text-nodelo-900 rounded-2xl px-4 py-2">
                        <p className="text-sm italic text-nodelo-600">
                          {isTyping[selectedChat._id].userName} is typing...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-nodelo-200">
                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {selectedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 bg-nodelo-50 px-2 py-1 rounded text-sm"
                        >
                          <span className="text-nodelo-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <label className="cursor-pointer p-2 border border-nodelo-200 rounded-lg hover:bg-nodelo-50 transition-colors">
                      <FiPaperclip className="w-5 h-5 text-nodelo-600" />
                      <input
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                        accept="image/*,video/*,.pdf"
                        disabled={isSending}
                      />
                    </label>
                    <input
                      type="text"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-nodelo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-nodelo-500"
                      disabled={isSending}
                    />
                    <Button
                      type="submit"
                      disabled={isSending || (!messageText.trim() && selectedFiles.length === 0)}
                      className="bg-nodelo-500 hover:bg-nodelo-600 text-white"
                    >
                      <FiSend className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-nodelo-600">
                <div className="text-center">
                  <FiMessageCircle className="w-16 h-16 mx-auto mb-4 text-nodelo-300" />
                  <p>Select a chat to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}

