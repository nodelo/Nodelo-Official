"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { FiMail, FiLock, FiLoader, FiArrowRight, FiArrowLeft } from "react-icons/fi"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated, isLoading: authLoading } = useAuth()
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, authLoading, router])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError("")

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        router.push("/admin/dashboard")
      } else {
        setSubmitError(result.error || "Login failed. Please check your credentials.")
      }
    } catch (error) {
      console.error("Login error:", error)
      setSubmitError("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
    if (submitError) {
      setSubmitError("")
    }
  }

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nodelo-50 via-white to-nodelo-100">
        <FiLoader className="w-8 h-8 text-nodelo-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-nodelo-50 via-white to-nodelo-100 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-nodelo-900 mb-2">Nodelo Admin</h1>
          <p className="text-nodelo-600">Sign in to your admin account</p>
        </div>

        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl p-8 space-y-6 border border-nodelo-200/50"
        >
          {/* Error Message */}
          {submitError && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              role="alert"
            >
              {submitError}
            </div>
          )}

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-nodelo-900 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-nodelo-400 w-5 h-5" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white transition-all ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-nodelo-400/20 focus:border-nodelo-500 focus:ring-nodelo-500/20"
                } focus:outline-none focus:ring-4`}
                placeholder="admin@example.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-red-500 text-sm mt-1.5" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-nodelo-900 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-nodelo-400 w-5 h-5" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 bg-white transition-all ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                    : "border-nodelo-400/20 focus:border-nodelo-500 focus:ring-nodelo-500/20"
                } focus:outline-none focus:ring-4`}
                placeholder="••••••••"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-sm mt-1.5" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-nodelo-500 hover:bg-nodelo-600 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-5 h-5 animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <FiArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-6 space-y-2"
        >
          <p className="text-nodelo-600 text-sm">
            Don't have an account?{" "}
            <Link
              href="/admin/register"
              className="text-nodelo-500 hover:text-nodelo-600 font-semibold transition-colors inline-flex items-center gap-1"
            >
              Create account
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </p>
          <Link
            href="/"
            className="text-nodelo-600 hover:text-nodelo-700 text-sm inline-flex items-center gap-1 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

