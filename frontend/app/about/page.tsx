"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Image from "next/image"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CTAButton from "@/components/CTAButton"
import {
  FiZap,
  FiShield,
  FiEye,
  FiUsers,
  FiCode,
  FiTrendingUp,
  FiAward,
  FiArrowRight,
  FiGlobe,
  FiHeart,
} from "react-icons/fi"

export default function AboutPage() {
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: missionRef, inView: missionInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: valuesRef, inView: valuesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: teamRef, inView: teamInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: whyRef, inView: whyInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: statsRef, inView: statsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const values = [
    {
      icon: FiZap,
      title: "Speed",
      description:
        "Fast delivery without cutting corners. We use proven tools and efficient workflows to ship quality code in weeks, not months.",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      icon: FiShield,
      title: "Quality",
      description:
        "Production-ready code that follows best practices. Clean, maintainable, and built to scale with your business from day one.",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: FiEye,
      title: "Transparency",
      description:
        "Clear pricing, honest timelines, and regular updates. You always know what you're getting, when, and why.",
      gradient: "from-blue-500 to-purple-500",
    },
  ]

  // TODO: Replace with actual team member information
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      bio:
        "With over 8 years of experience building web applications for startups and enterprises. Specializes in full-stack development, system architecture, and blockchain solutions.",
      image: "/placeholder-user.jpg", // Replace with actual team photo
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#",
      },
    },
    // Add more team members here
  ]

  const whyChooseUs = [
    {
      icon: FiCode,
      title: "Experienced Team",
      description:
        "Our team brings years of experience building products from scratch. We've worked with startups, agencies, and enterprises.",
    },
    {
      icon: FiTrendingUp,
      title: "Proven Track Record",
      description:
        "150+ successful projects delivered on time. Our clients launch faster and scale with confidence.",
    },
    {
      icon: FiAward,
      title: "Code Ownership",
      description:
        "You own 100% of the code, designs, and assets. No vendor lock-in. Complete transparency and control.",
    },
    {
      icon: FiUsers,
      title: "Partnership Approach",
      description:
        "We're not just vendors. We're your product partners, invested in your success and growth.",
    },
  ]

  const stats = [
    { value: "150+", label: "Happy Clients", icon: FiUsers },
    { value: "500+", label: "Projects Delivered", icon: FiCode },
    { value: "99%", label: "On-Time Delivery", icon: FiZap },
    { value: "4.9/5", label: "Client Rating", icon: FiAward },
  ]

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Enhanced Hero Section */}
        <section ref={heroRef} className="relative min-h-[60vh] overflow-hidden bg-gradient-to-br from-nodelo-900 via-nodelo-800 to-nodelo-900 text-white">
          {/* Background patterns */}
          <div className="absolute inset-0">
            <div className="absolute -top-1/2 -right-1/2 w-[100%] h-[100%] rounded-full bg-nodelo-500/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -left-1/2 w-[100%] h-[100%] rounded-full bg-nodelo-400/10 blur-3xl animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-grid-overlay opacity-30" />
          </div>

          <div className="container-nodelo relative z-10 py-24 md:py-32">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 bg-nodelo-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-nodelo-500/30 mb-6"
              >
                <FiHeart className="text-nodelo-500" />
                <span className="text-sm font-medium text-nodelo-100">About Nodelo</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                We build products that <span className="text-transparent bg-clip-text bg-gradient-to-r from-nodelo-500 to-nodelo-400">make an impact</span>
              </h1>

              <p className="text-xl md:text-2xl text-nodelo-100 mb-8 leading-relaxed">
                A team of designers and developers helping startups and businesses turn ideas into production-ready software. Fast, reliable, and built to last.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission/Story Section */}
        <section ref={missionRef} className="py-20 bg-white">
          <div className="container-nodelo max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={missionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">Our Story</h2>
                <p className="text-lg text-text/80">
                  How we started and what drives us
                </p>
              </div>

              <div className="space-y-6 text-lg text-text/80 leading-relaxed">
                <p>
                  Nodelo was founded with a simple mission: help businesses ship great software faster without compromising on quality. We saw too many teams stuck in development cycles that took months or years, missing market opportunities and burning through budgets.
                </p>
                <p>
                  We believe great software doesn't have to take forever. By combining proven frameworks, modern tools, and efficient workflows, we deliver high-quality applications in weeks, not months. Our clients get to market faster while maintaining the code quality and user experience their products deserve.
                </p>
                <p>
                  Whether you need a landing page, a full-stack web application, or a blockchain solution, we bring the same commitment to excellence. Clear communication, transparent pricing, and reliable delivery are at the core of everything we do.
                </p>
                <p className="text-nodelo-900 font-semibold">
                  Today, we're proud to have helped over 150 teams launch their products, and we're just getting started.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section ref={valuesRef} className="py-20 bg-nodelo-100">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">Our Values</h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-white rounded-2xl border border-nodelo-400/20 hover:border-nodelo-400/40 hover:shadow-xl transition-all duration-300">
                    <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <value.icon className="text-white text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-nodelo-900">{value.title}</h3>
                    <p className="text-text/80 leading-relaxed">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section ref={statsRef} className="py-20 bg-white">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={statsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-nodelo-900">By the numbers</h2>
              <p className="text-lg text-text/80">Our impact in real numbers</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={statsInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-nodelo-100 mb-4">
                    <stat.icon className="text-nodelo-500 text-2xl" />
                  </div>
                  <div className="text-4xl font-bold text-nodelo-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-text/70 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section ref={whyRef} className="py-20 bg-nodelo-100">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={whyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">Why work with us?</h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                What makes us different from other development agencies
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={whyInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-white rounded-2xl border border-nodelo-400/20 hover:border-nodelo-400/40 hover:shadow-xl transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-nodelo-500 to-nodelo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-nodelo-900">{item.title}</h3>
                    <p className="text-text/80 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section ref={teamRef} className="py-20 bg-white">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={teamInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">Meet the Team</h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                The people behind Nodelo
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={teamInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-nodelo-100 rounded-2xl border border-nodelo-400/20 hover:shadow-xl transition-all duration-300 text-center">
                    <div className="relative w-32 h-32 mx-auto mb-6">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={128}
                        height={128}
                        className="rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-1 text-nodelo-900">{member.name}</h3>
                    <p className="text-nodelo-500 mb-4 font-medium">{member.role}</p>
                    <p className="text-text/80 text-sm leading-relaxed mb-4">{member.bio}</p>
                    {/* Social links - uncomment if needed */}
                    {/* <div className="flex gap-3 justify-center">
                      <a href={member.social.twitter} className="text-nodelo-500 hover:text-nodelo-600">
                        <FiTwitter className="w-5 h-5" />
                      </a>
                      <a href={member.social.linkedin} className="text-nodelo-500 hover:text-nodelo-600">
                        <FiLinkedin className="w-5 h-5" />
                      </a>
                      <a href={member.social.github} className="text-nodelo-500 hover:text-nodelo-600">
                        <FiGithub className="w-5 h-5" />
                      </a>
                    </div> */}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Note: If you have more team members, add them to the teamMembers array above */}
            {teamMembers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text/60">Team information coming soon...</p>
              </div>
            )}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-24 overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-gradient-to-br from-nodelo-900 via-nodelo-800 to-nodelo-900">
            <div className="absolute inset-0 bg-grid-overlay opacity-50" />
          </div>

          {/* Floating elements */}
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 left-10 w-20 h-20 bg-nodelo-500/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-10 right-10 w-32 h-32 bg-nodelo-400/20 rounded-full blur-3xl"
          />

          <div className="container-nodelo relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Let's build something together
              </h2>
              <p className="text-xl text-nodelo-100 mb-10 max-w-2xl mx-auto">
                Ready to turn your idea into reality? Get in touch for a free consultation and let's discuss your project.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/contact" variant="primary" ariaLabel="Contact us" className="group">
                  <span className="flex items-center gap-2">
                    Contact us
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CTAButton>
                <CTAButton href="/services" variant="ghost" ariaLabel="View our services">
                  View our services
                </CTAButton>
              </div>

              <p className="mt-8 text-sm text-nodelo-100/80">
                Free consultation • No commitment required • Quick response
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
