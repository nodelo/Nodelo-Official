"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import api, { setAuthToken, removeAuthToken } from "@/lib/api"

export interface User {
  _id: string
  email: string
  name?: string
  role: "admin" | "user"
  isActive: boolean
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  /**
   * Check authentication status
   */
  const checkAuth = async () => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

      if (!storedToken) {
        setIsLoading(false)
        return
      }

      setAuthToken(storedToken)
      const response = await api.get("/api/auth/me")

      if (response.success && response.data) {
        setUser(response.data)
        setToken(storedToken)
      } else {
        // Token is invalid, clear it
        removeAuthToken()
        setToken(null)
        setUser(null)
      }
    } catch (error) {
      console.error("Auth check error:", error)
      removeAuthToken()
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Login function
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{
        user: User
        token: string
      }>("/api/auth/login", {
        email,
        password,
      })

      if (response.success && response.data) {
        const { user, token } = response.data
        setAuthToken(token)
        setToken(token)
        setUser(user)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.error || "Login failed",
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  /**
   * Register function
   */
  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await api.post<{
        user: User
        token: string
      }>("/api/auth/register", {
        email,
        password,
        name,
      })

      if (response.success && response.data) {
        const { user, token } = response.data
        setAuthToken(token)
        setToken(token)
        setUser(user)
        return { success: true }
      } else {
        return {
          success: false,
          error: response.error || "Registration failed",
        }
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Registration failed",
      }
    }
  }

  /**
   * Logout function
   */
  const logout = () => {
    removeAuthToken()
    setToken(null)
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    checkAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

