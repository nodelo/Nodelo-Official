"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import CTAButton from "./CTAButton"
import { FiCheck, FiArrowRight } from "react-icons/fi"

interface ServiceCardProps {
  icon: React.ReactNode
  title: string
  features: string[]
  priceRange: string
  description?: string
  popular?: boolean
  gradient?: string
  timeline?: string
}

export default function ServiceCard({
  icon,
  title,
  features,
  priceRange,
  description,
  popular = false,
  gradient = "from-nodelo-500 to-nodelo-400",
  timeline,
}: ServiceCardProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="relative group"
    >
      <div
        className={`h-full p-8 rounded-2xl border-2 ${
          popular
            ? "border-nodelo-500 shadow-xl shadow-nodelo-500/20"
            : "border-nodelo-400/20"
        } hover:shadow-2xl transition-all duration-300 bg-white relative overflow-hidden`}
      >
        {/* Background gradient on hover */}
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

        {popular && (
          <div className="absolute -top-1 -right-1">
            <div className="bg-nodelo-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-semibold">
              Most Popular
            </div>
          </div>
        )}

        <div className="relative z-10">
          {/* Icon */}
          <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
            {icon}
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold mb-3 text-nodelo-900">{title}</h3>

          {/* Description */}
          {description && <p className="text-text/80 mb-6 leading-relaxed">{description}</p>}

          {/* Timeline */}
          {timeline && (
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-nodelo-100 rounded-full text-sm font-medium text-nodelo-900">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-nodelo-500"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {timeline}
              </span>
            </div>
          )}

          {/* Features */}
          <ul className="space-y-3 mb-8">
            {features.map((feature, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <FiCheck className="text-nodelo-500 mt-0.5 shrink-0" />
                <span className="text-text/80">{feature}</span>
              </motion.li>
            ))}
          </ul>

          {/* Price */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-nodelo-900 mb-1">{priceRange}</p>
            {priceRange.includes("/mo") && (
              <p className="text-sm text-text/60">per month</p>
            )}
          </div>

          {/* CTA Button */}
          <CTAButton
            href="/contact"
            variant={popular ? "primary" : "secondary"}
            className="w-full group"
          >
            <span className="flex items-center justify-center gap-2">
              Get started
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </CTAButton>
        </div>
      </div>
    </motion.div>
  )
}
