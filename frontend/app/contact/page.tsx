"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"
import CTAButton from "@/components/CTAButton"
import {
  FiMail,
  FiClock,
  FiFileText,
  FiMessageCircle,
  FiArrowRight,
  FiCheck,
} from "react-icons/fi"

export default function ContactPage() {
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: formRef, inView: formInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: infoRef, inView: infoInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const contactInfo = [
    {
      icon: FiMail,
      title: "Email Us",
      description: "Drop us a line anytime",
      value: "hello@nodelo.com", // TODO: Replace with actual email
      link: "mailto:hello@nodelo.com",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: FiMessageCircle,
      title: "Quick Response",
      description: "We reply within 2 business days",
      value: "Usually within 24 hours",
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: FiFileText,
      title: "Free Consultation",
      description: "Expert advice at no cost",
      value: "No obligation",
      gradient: "from-nodelo-500 to-nodelo-400",
    },
  ]

  const benefits = [
    {
      icon: FiCheck,
      text: "Response within 2 business days",
    },
    {
      icon: FiCheck,
      text: "Free consultation on your project",
    },
    {
      icon: FiCheck,
      text: "Clear proposal with timeline and pricing",
    },
    {
      icon: FiCheck,
      text: "No commitment required",
    },
  ]

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Enhanced Hero Section */}
        <section ref={heroRef} className="relative min-h-[50vh] overflow-hidden bg-gradient-to-br from-nodelo-900 via-nodelo-800 to-nodelo-900 text-white">
          {/* Background patterns */}
          <div className="absolute inset-0">
            <div className="absolute -top-1/2 -right-1/2 w-[100%] h-[100%] rounded-full bg-nodelo-500/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-1/2 -left-1/2 w-[100%] h-[100%] rounded-full bg-nodelo-400/10 blur-3xl animate-pulse delay-1000" />
            <div className="absolute inset-0 bg-grid-overlay opacity-30" />
          </div>

          <div className="container-nodelo relative z-10 py-20 md:py-32">
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
                <FiMessageCircle className="text-nodelo-500" />
                <span className="text-sm font-medium text-nodelo-100">Get in Touch</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Let's start your <span className="text-transparent bg-clip-text bg-gradient-to-r from-nodelo-500 to-nodelo-400">project</span>
              </h1>

              <p className="text-xl md:text-2xl text-nodelo-100 mb-8 leading-relaxed">
                Tell us about your project, and we'll provide a detailed proposal with timeline and pricing. Free consultation, no commitment required.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Form and Info Section */}
        <section ref={formRef} className="py-20 bg-linear-to-b from-white to-nodelo-100">
          <div className="container-nodelo max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Contact Form - Takes 2 columns */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={formInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6 }}
                >
                  <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-nodelo-400/20">
                    <h2 className="text-3xl font-bold text-nodelo-900 mb-4">Send us a message</h2>
                    <p className="text-text/80 mb-8">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </p>
                    <ContactForm />
                  </div>
                </motion.div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={formInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  {/* Contact Information Cards */}
                  {contactInfo.map((info, index) => (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={formInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                      className="group"
                    >
                      <div className="bg-white p-6 rounded-2xl border border-nodelo-400/20 hover:shadow-lg transition-all duration-300">
                        <div className={`w-14 h-14 bg-gradient-to-br ${info.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                          <info.icon className="text-white text-2xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-nodelo-900 mb-1">{info.title}</h3>
                        <p className="text-sm text-text/60 mb-2">{info.description}</p>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-nodelo-500 hover:text-nodelo-600 font-medium text-sm"
                          >
                            {info.value} →
                          </a>
                        ) : (
                          <p className="text-text/80 font-medium text-sm">{info.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}

                  {/* Benefits List */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={formInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="bg-gradient-to-br from-nodelo-500/10 to-nodelo-400/10 p-6 rounded-2xl border border-nodelo-400/20"
                  >
                    <h3 className="text-lg font-semibold text-nodelo-900 mb-4">What to expect</h3>
                    <ul className="space-y-3">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <FiCheck className="text-nodelo-500 mt-0.5 shrink-0" />
                          <span className="text-text/80 text-sm">{benefit.text}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section ref={infoRef} className="py-20 bg-white">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={infoInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                Why reach out to us?
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                We make it easy to get started on your project
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: FiClock,
                  title: "Quick Response",
                  description: "We respond to all inquiries within 2 business days, usually within 24 hours.",
                  gradient: "from-blue-500 to-purple-500",
                },
                {
                  icon: FiMessageCircle,
                  title: "Free Consultation",
                  description: "Get expert advice on your project at no cost. No strings attached.",
                  gradient: "from-green-500 to-teal-500",
                },
                {
                  icon: FiFileText,
                  title: "Clear Proposal",
                  description: "Receive a detailed proposal with timeline, pricing, and deliverables.",
                  gradient: "from-nodelo-500 to-nodelo-400",
                },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={infoInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-nodelo-100 rounded-2xl border border-nodelo-400/20 hover:border-nodelo-400/40 hover:shadow-xl transition-all duration-300 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <item.icon className="text-white text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-nodelo-900">{item.title}</h3>
                    <p className="text-text/80 leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
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

          <div className="container-nodelo relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Ready to get started?
              </h2>
              <p className="text-xl text-nodelo-100 mb-10 max-w-2xl mx-auto">
                Have questions? Want to discuss your project in detail? We're here to help.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/services" variant="primary" ariaLabel="View our services" className="group">
                  <span className="flex items-center gap-2">
                    View our services
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CTAButton>
                <CTAButton href="/about" variant="ghost" ariaLabel="Learn more about us">
                  Learn more about us
                </CTAButton>
              </div>

              <p className="mt-8 text-sm text-nodelo-100/80">
                Free consultation • Quick response • No commitment required
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
