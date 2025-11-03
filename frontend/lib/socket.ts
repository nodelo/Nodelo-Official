import { io, Socket } from "socket.io-client"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"

let socket: Socket | null = null

/**
 * Get or create Socket.io connection
 */
export const getSocket = (): Socket => {
  if (!socket || !socket.connected) {
    socket = io(API_BASE_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    socket.on("connect", () => {
      console.log("Socket.io connected:", socket?.id)
    })

    socket.on("disconnect", () => {
      console.log("Socket.io disconnected")
    })

    socket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error)
    })
  }

  return socket
}

/**
 * Disconnect Socket.io
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

/**
 * Join a chat room
 */
export const joinChat = (chatId: string) => {
  const socket = getSocket()
  socket.emit("joinChat", chatId)
}

/**
 * Leave a chat room
 */
export const leaveChat = (chatId: string) => {
  const socket = getSocket()
  socket.emit("leaveChat", chatId)
}

/**
 * Send typing indicator
 */
export const sendTyping = (chatId: string, isTyping: boolean, userName: string) => {
  const socket = getSocket()
  socket.emit("typing", { chatId, isTyping, userName })
}

/**
 * Stop typing indicator
 */
export const stopTyping = (chatId: string) => {
  const socket = getSocket()
  socket.emit("stopTyping", { chatId })
}

/**
 * Mark messages as read via socket
 */
export const markMessagesRead = (
  chatId: string,
  messageIds: string[],
  senderType: "user" | "admin"
) => {
  const socket = getSocket()
  socket.emit("markRead", { chatId, messageIds, senderType })
}

export default getSocket

