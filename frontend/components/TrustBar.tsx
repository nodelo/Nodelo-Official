"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import CountUp from "react-countup"
import { FiUsers, FiCode, FiClock, FiAward } from "react-icons/fi"

export default function TrustBar() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const stats = [
    {
      icon: FiUsers,
      value: 150,
      suffix: "+",
      label: "Happy Clients",
      color: "text-nodelo-500",
    },
    {
      icon: FiCode,
      value: 500,
      suffix: "+",
      label: "Projects Delivered",
      color: "text-nodelo-400",
    },
    {
      icon: FiClock,
      value: 99,
      suffix: "%",
      label: "On-Time Delivery",
      color: "text-nodelo-500",
    },
    {
      icon: FiAward,
      value: 4.9,
      suffix: "/5",
      label: "Client Rating",
      color: "text-nodelo-400",
      decimals: 1,
    },
  ]

  const partners = [
    { name: "TechVentures", logo: "TV" },
    { name: "StartupLab", logo: "SL" },
    { name: "InnovateCo", logo: "IC" },
    { name: "DigitalFirst", logo: "DF" },
    { name: "CloudScale", logo: "CS" },
    { name: "NextGen", logo: "NG" },
  ]

  return (
    <section className="py-20 bg-linear-to-b from-white to-nodelo-100 relative overflow-hidden">
      {/* Background decoration (very subtle to avoid washout) */}
      <div className="absolute inset-0">
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-nodelo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] bg-nodelo-400/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-grid-overlay opacity-[0.08]" />
      </div>

      <div className="container-nodelo relative z-10">
        {/* Stats Section */}
        <div ref={ref} className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-nodelo-900">
              Trusted by innovators worldwide
            </h2>
            <p className="text-lg text-text/80 max-w-2xl mx-auto">
              Join hundreds of companies that have transformed their ideas into reality with Nodelo
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-nodelo-400/20 ${stat.color} mb-4`}>
                  <stat.icon className="text-2xl" />
                </div>
                <div className="text-4xl font-bold text-nodelo-900 mb-2">
                  {inView && (
                    <CountUp
                      start={0}
                      end={stat.value}
                      duration={2.5}
                      decimals={stat.decimals || 0}
                      suffix={stat.suffix}
                    />
                  )}
                </div>
                <div className="text-sm text-text/70 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Partners Section */}
        <div className="relative">
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center text-text/70 text-sm mb-8 font-medium uppercase tracking-wider"
          >
            Powering innovation at
          </motion.p>

          {/* Partner logos marquee */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 20,
                  ease: "linear",
                },
              }}
              className="flex gap-12"
            >
              {/* Duplicate the partners array for seamless loop */}
              {[...partners, ...partners].map((partner, index) => (
                <motion.div
                  key={`${partner.name}-${index}`}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.5 + (index % partners.length) * 0.1 }}
                  className="shrink-0"
                >
                  <div className="group cursor-pointer">
                    <div className="w-32 h-16 bg-white rounded-xl border border-nodelo-400/30 flex items-center justify-center transition-all duration-300 group-hover:shadow-md group-hover:scale-105 group-hover:border-nodelo-400/50">
                      <span className="text-2xl font-bold bg-gradient-to-r from-nodelo-500 to-nodelo-400 bg-clip-text text-transparent">
                        {partner.logo}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}