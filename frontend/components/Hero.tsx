"use client"

import { motion } from "framer-motion"
import CTAButton from "./CTAButton"
import { FiCode, FiZap, FiShield, FiTrendingUp, FiUsers, FiGlobe } from "react-icons/fi"

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-nodelo-900 via-nodelo-800 to-nodelo-900 text-white">
      {/* Animated background patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[100%] h-[100%] rounded-full bg-nodelo-500/10 blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[100%] h-[100%] rounded-full bg-nodelo-400/10 blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-overlay opacity-50" />
      </div>

      <div className="container-nodelo relative z-10 pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column: Headline and CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 bg-nodelo-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-nodelo-500/30 mb-6"
            >
              <FiZap className="text-nodelo-500" />
              <span className="text-sm font-medium text-nodelo-100">Product studio & engineering team</span>
            </motion.div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              We design and build <span className="text-transparent bg-clip-text bg-gradient-to-r from-nodelo-500 to-nodelo-400">custom software</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-nodelo-100 mb-8 leading-relaxed">
              Share your idea, features, and timeline—our team will scope it, design it, and ship it. We partner with founders and teams to deliver polished websites, web apps, and platforms.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-nodelo-500">150+</div>
                <div className="text-sm text-nodelo-100">Clients & teams</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-nodelo-400">500+</div>
                <div className="text-sm text-nodelo-100">Projects delivered</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-nodelo-500">4.9/5</div>
                <div className="text-sm text-nodelo-100">Average rating</div>
              </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <CTAButton href="/contact" variant="primary" ariaLabel="Start your project">
                Tell us about your project
              </CTAButton>
              <CTAButton href="/services" variant="ghost" ariaLabel="Explore our services">
                Explore services
              </CTAButton>
            </div>
          </motion.div>

          {/* Right column: Interactive feature showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            {/* Central hub */}
            <div className="relative w-[500px] h-[500px] mx-auto">
              {/* Center circle */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-nodelo-500 to-nodelo-400 rounded-full shadow-2xl shadow-nodelo-500/50 flex items-center justify-center">
                  <FiCode className="text-white text-4xl" />
                </div>
              </motion.div>

              {/* Orbiting features */}
              {[
                { icon: FiZap, label: "Fast Delivery", color: "bg-yellow-500", delay: 0 },
                { icon: FiShield, label: "Secure Code", color: "bg-green-500", delay: 0.2 },
                { icon: FiTrendingUp, label: "Scalable", color: "bg-blue-500", delay: 0.4 },
                { icon: FiUsers, label: "User Focused", color: "bg-purple-500", delay: 0.6 },
                { icon: FiGlobe, label: "Global Ready", color: "bg-pink-500", delay: 0.8 },
              ].map((feature, index) => {
                const angle = (index * 72 * Math.PI) / 180
                const radius = 180
                const x = Math.cos(angle) * radius
                const y = Math.sin(angle) * radius

                return (
                  <motion.div
                    key={feature.label}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: feature.delay }}
                    className="absolute top-1/2 left-1/2"
                    style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
                  >
                    <motion.div
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        delay: index * 0.5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className={`${feature.color} w-20 h-20 rounded-2xl shadow-lg flex flex-col items-center justify-center gap-1 backdrop-blur-sm bg-opacity-90`}
                    >
                      <feature.icon className="text-white text-2xl" />
                      <span className="text-white text-xs font-medium px-2 text-center">{feature.label}</span>
                    </motion.div>
                  </motion.div>
                )
              })}

              {/* Connection lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[0, 1, 2, 3, 4].map((i) => {
                  const angle = (i * 72 * Math.PI) / 180
                  const radius = 180
                  const x = Math.cos(angle) * radius + 250
                  const y = Math.sin(angle) * radius + 250

                  return (
                    <motion.line
                      key={i}
                      x1="250"
                      y1="250"
                      x2={x}
                      y2={y}
                      stroke="rgba(61, 220, 132, 0.2)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: i * 0.2 }}
                    />
                  )
                })}
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-nodelo-500/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-nodelo-500 rounded-full mt-2" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}