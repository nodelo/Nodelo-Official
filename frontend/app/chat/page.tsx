"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { FiSend, FiPaperclip, FiX, FiMessageCircle, FiLoader } from "react-icons/fi"
import api from "@/lib/api"
import { getSocket, joinChat, leaveChat } from "@/lib/socket"
import { Button } from "@/components/ui/button"

interface Message {
  _id: string
  chatId: string
  senderType: "user" | "admin"
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
  userName: string
  userEmail: string
  adminName?: string
  status: string
}

export default function ChatPage() {
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [error, setError] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load chat info from localStorage if exists
  useEffect(() => {
    const savedChat = localStorage.getItem("chat_info")
    const savedName = localStorage.getItem("user_name")
    const savedEmail = localStorage.getItem("user_email")
    
    if (savedChat && savedName && savedEmail) {
      setChat(JSON.parse(savedChat))
      setUserName(savedName)
      setUserEmail(savedEmail)
      fetchMessages(JSON.parse(savedChat)._id)
    }
  }, [])

  useEffect(() => {
    if (chat) {
      // Setup Socket.io for real-time updates
      const socket = getSocket()
      joinChat(chat._id)

      const handleNewMessage = (message: Message) => {
        // Check if message belongs to current chat
        if (message.chatId === chat._id || message.chatId?.toString() === chat._id.toString()) {
          setMessages((prev) => {
            // Avoid duplicates
            if (prev.some((m) => m._id === message._id)) {
              return prev
            }
            return [...prev, message]
          })
          scrollToBottom()
        }
      }

      socket.on("newMessage", handleNewMessage)

      // Also poll for messages periodically as backup
      const pollInterval = setInterval(() => {
        if (chat._id) {
          fetchMessages(chat._id)
        }
      }, 3000) // Poll every 3 seconds

      return () => {
        leaveChat(chat._id)
        socket.off("newMessage", handleNewMessage)
        clearInterval(pollInterval)
      }
    }
  }, [chat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!userName.trim() || !userEmail.trim()) {
      setError("Please enter your name and email")
      return
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)

    try {
      // Start conversation by sending first message
      const formData = new FormData()
      formData.append("content", "Hello, I'd like to start a conversation")
      formData.append("userName", userName.trim())
      formData.append("userEmail", userEmail.trim())

      const response = await api.post("/api/chats/message", formData, true)

      if (response.success && response.data) {
        // Get chatId from response (either from chat object or data.chatId)
        const chatId = response.data.chatId || response.chat?._id || response.data._id
        
        if (!chatId) {
          setError("Failed to get chat ID. Please try again.")
          return
        }
        
        const newChat = {
          _id: chatId,
          userName: userName.trim(),
          userEmail: userEmail.trim().toLowerCase(),
          status: "active",
        }
        setChat(newChat)
        
        // Save to localStorage
        localStorage.setItem("chat_info", JSON.stringify(newChat))
        localStorage.setItem("user_name", userName.trim())
        localStorage.setItem("user_email", userEmail.trim())

        // Fetch messages
        fetchMessages(newChat._id)
      } else {
        setError(response.error || "Failed to start conversation")
      }
    } catch (error) {
      console.error("Error starting chat:", error)
      setError("Failed to start conversation. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchMessages = async (chatId: string) => {
    try {
      const response = await api.get<{ messages: Message[] }>(`/api/chats/${chatId}?userEmail=${encodeURIComponent(userEmail)}`)
      
      if (response.success && response.data) {
        const fetchedMessages = response.data.messages || []
        // Sort by createdAt to ensure proper order
        const sortedMessages = fetchedMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        )
        setMessages(sortedMessages)
        scrollToBottom()
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!chat || (!messageText.trim() && selectedFiles.length === 0)) {
      return
    }

    setIsSending(true)

    try {
      const formData = new FormData()
      formData.append("chatId", chat._id)
      if (messageText.trim()) {
        formData.append("content", messageText.trim())
      }
      formData.append("userName", userName)
      formData.append("userEmail", userEmail)

      // Append files
      selectedFiles.forEach((file) => {
        formData.append("files", file)
      })

      const response = await api.post("/api/chats/message", formData, true)

      if (response.success) {
        setMessageText("")
        setSelectedFiles([])
        // Refresh messages immediately to get the actual server response with correct senderType
        fetchMessages(chat._id)
      }
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 5))
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  if (!chat) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-br from-nodelo-50 via-white to-nodelo-100 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-8 border border-nodelo-200"
            >
              <div className="text-center mb-8">
                <FiMessageCircle className="w-16 h-16 text-nodelo-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-nodelo-900 mb-2">
                  Start a Conversation
                </h1>
                <p className="text-nodelo-600">
                  Chat with our team in real-time. We're here to help!
                </p>
              </div>

              <form onSubmit={handleStartChat} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-nodelo-900 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-4 py-3 border border-nodelo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nodelo-500"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-nodelo-900 mb-2">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-nodelo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-nodelo-500"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-nodelo-500 hover:bg-nodelo-600 text-white font-semibold py-3 rounded-xl"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="w-5 h-5 animate-spin inline mr-2" />
                      Starting...
                    </>
                  ) : (
                    "Start Conversation"
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="min-h-screen flex w-screen bg-gradient-to-br from-nodelo-50 via-white to-nodelo-100 py-12 px-4">
        <div className="max-w-4xl lg:w-4xl md:w-xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-nodelo-200 flex flex-col"
            style={{ height: "calc(100vh - 8rem)" }}
          >
            {/* Chat Header */}
            <div className="p-6 border-b border-nodelo-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-nodelo-900">Chat with Nodelo</h2>
                  <p className="text-sm text-nodelo-600">
                    {chat.adminName ? `Chatting with ${chat.adminName}` : "Waiting for admin to join..."}
                  </p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                  Active
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-nodelo-600 py-8">
                  No messages yet. Start the conversation!
                </div>
              ) : (
                messages.map((message) => {
                  // Determine alignment: user messages go right, admin messages go left
                  // Normalize senderType to handle any case issues
                  const senderType = String(message.senderType || "").toLowerCase().trim()
                  const isUserMessage = senderType === "user"
                  const isAdminMessage = senderType === "admin"
                  
                  // Debug logging (remove in production)
                  if (process.env.NODE_ENV === "development") {
                    console.log("Message:", {
                      id: message._id,
                      senderType: message.senderType,
                      normalized: senderType,
                      isUser: isUserMessage,
                      isAdmin: isAdminMessage,
                      senderName: message.senderName
                    })
                  }
                  
                  // Ensure correct alignment based on sender type
                  const alignRight = isUserMessage // User messages on right
                  const alignLeft = isAdminMessage  // Admin messages on left
                  
                  return (
                    <motion.div
                      key={message._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${alignRight ? "justify-end" : alignLeft ? "justify-start" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          isUserMessage
                            ? "bg-nodelo-500 text-white shadow-sm"
                            : "bg-nodelo-100 text-nodelo-900 border-2 border-nodelo-200 shadow-sm"
                        }`}
                      >
                        {isAdminMessage && (
                          <div className="text-xs font-medium mb-1 opacity-75">
                            {message.senderName}
                          </div>
                        )}
                        {message.content && (
                          <p className={`text-sm ${isUserMessage ? "text-white" : "text-nodelo-900"}`}>
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
                                className={`block text-sm underline ${isUserMessage ? "text-white" : "text-nodelo-600"}`}
                              >
                                📎 {attachment.fileName}
                              </a>
                            ))}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${isUserMessage ? "opacity-75 text-white" : "opacity-60 text-nodelo-600"}`}>
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-6 border-t border-nodelo-200">
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
          </motion.div>
        </div>
      </main>
    </>
  )
}

