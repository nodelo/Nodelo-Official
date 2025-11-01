"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { FiSend, FiCheck, FiLoader } from "react-icons/fi"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: "",
    budget: "",
    message: "",
    privacy: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    if (!formData.privacy) {
      newErrors.privacy = "You must accept the privacy policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          projectType: formData.projectType || undefined,
          budget: formData.budget || undefined,
          message: formData.message,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setIsSubmitted(true)
        setFormData({
          name: "",
          email: "",
          company: "",
          projectType: "",
          budget: "",
          message: "",
          privacy: false,
        })
      } else {
        setErrors({ submit: data.error || "Something went wrong. Please try again." })
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setErrors({ submit: "Network error. Please check your connection and try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-nodelo-500/10 to-nodelo-400/10 border-2 border-nodelo-500/30 rounded-2xl p-12 text-center"
        role="alert"
        aria-live="polite"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 bg-gradient-to-br from-nodelo-500 to-nodelo-400 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <FiCheck className="text-white text-4xl" />
        </motion.div>
        <h3 className="text-3xl font-bold text-nodelo-900 mb-3">Message sent successfully!</h3>
        <p className="text-text/80 text-lg mb-6">
          We've received your message and will get back to you within 2 business days.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-nodelo-500 hover:text-nodelo-600 font-medium underline"
        >
          Send another message
        </button>
      </motion.div>
    )
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-nodelo-900 mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all ${
              errors.name
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-nodelo-400/20 focus:border-nodelo-500 focus:ring-nodelo-500/20"
            } focus:outline-none focus:ring-4`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-red-500 text-sm mt-1.5" role="alert">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-nodelo-900 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                : "border-nodelo-400/20 focus:border-nodelo-500 focus:ring-nodelo-500/20"
            } focus:outline-none focus:ring-4`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-red-500 text-sm mt-1.5" role="alert">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Company and Project Type Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-nodelo-900 mb-2">
            Company <span className="text-text/50 text-xs font-normal">(optional)</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-nodelo-400/20 bg-white focus:outline-none focus:ring-4 focus:ring-nodelo-500/20 focus:border-nodelo-500 transition-all"
          />
        </div>

        {/* Project Type */}
        <div>
          <label htmlFor="projectType" className="block text-sm font-semibold text-nodelo-900 mb-2">
            Project Type <span className="text-text/50 text-xs font-normal">(optional)</span>
          </label>
          <select
            id="projectType"
            name="projectType"
            value={formData.projectType}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border-2 border-nodelo-400/20 bg-white focus:outline-none focus:ring-4 focus:ring-nodelo-500/20 focus:border-nodelo-500 transition-all"
          >
            <option value="">Select a project type</option>
            <option value="starter-site">Starter Site</option>
            <option value="mvp-web-app">MVP Web App</option>
            <option value="dapp-contract">dApp + Contract</option>
            <option value="support-ops">Support & Ops</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Budget (optional) */}
      <div>
        <label htmlFor="budget" className="block text-sm font-semibold text-nodelo-900 mb-2">
          Budget Range <span className="text-text/50 text-xs font-normal">(optional)</span>
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-3 rounded-xl border-2 border-nodelo-400/20 bg-white focus:outline-none focus:ring-4 focus:ring-nodelo-500/20 focus:border-nodelo-500 transition-all"
        >
          <option value="">Select a budget range</option>
          <option value="under-1k">Under $1,000</option>
          <option value="1k-5k">$1,000 - $5,000</option>
          <option value="5k-10k">$5,000 - $10,000</option>
          <option value="10k-25k">$10,000 - $25,000</option>
          <option value="25k-plus">$25,000+</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-nodelo-900 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          placeholder="Tell us about your project, timeline, and any specific requirements..."
          className={`w-full px-4 py-3 rounded-xl border-2 bg-white transition-all resize-none ${
            errors.message
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-nodelo-400/20 focus:border-nodelo-500 focus:ring-nodelo-500/20"
          } focus:outline-none focus:ring-4`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-red-500 text-sm mt-1.5" role="alert">
            {errors.message}
          </p>
        )}
      </div>

      {/* Privacy Checkbox */}
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name="privacy"
            checked={formData.privacy}
            onChange={handleChange}
            className={`mt-1 w-5 h-5 rounded border-2 transition-all ${
              errors.privacy
                ? "border-red-500"
                : "border-nodelo-400/30 group-hover:border-nodelo-500"
            } text-nodelo-500 focus:ring-2 focus:ring-nodelo-500 focus:ring-offset-2`}
            aria-invalid={!!errors.privacy}
            aria-describedby={errors.privacy ? "privacy-error" : undefined}
          />
          <span className="text-sm text-text/80">
            I agree to the{" "}
            <a href="/privacy" className="text-nodelo-500 hover:text-nodelo-600 font-semibold underline">
              privacy policy
            </a>{" "}
            and consent to being contacted about my inquiry. <span className="text-red-500">*</span>
          </span>
        </label>
        {errors.privacy && (
          <p id="privacy-error" className="text-red-500 text-sm mt-1.5 ml-8" role="alert">
            {errors.privacy}
          </p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
          <p className="text-red-600 text-sm">{errors.submit}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-nodelo-500 to-nodelo-400 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-nodelo-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin w-5 h-5" />
            Sending...
          </>
        ) : (
          <>
            Send message
            <FiSend className="w-5 h-5" />
          </>
        )}
      </button>
    </motion.form>
  )
}
