"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ServiceCard from "@/components/ServiceCard"
import CTAButton from "@/components/CTAButton"
import {
  FiLayout,
  FiCode,
  FiCpu,
  FiSettings,
  FiCheck,
  FiFileText,
  FiClock,
  FiArrowRight,
  FiZap,
  FiShield,
  FiTrendingUp,
} from "react-icons/fi"

export default function ServicesPage() {
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: includedRef, inView: includedInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: processRef, inView: processInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: faqRef, inView: faqInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const services = [
    {
      icon: <FiLayout className="text-white text-3xl" />,
      title: "Starter Site",
      description: "Perfect for businesses needing a professional web presence quickly. Ideal for landing pages, portfolios, and small business websites.",
      features: [
        "2–4 pages (Home, About, Services, Contact)",
        "SEO optimized with meta tags and structured data",
        "Fully responsive design (mobile-first)",
        "Contact form integration",
        "Fast loading times and performance optimization",
        "Basic analytics setup",
      ],
      priceRange: "$300–$900",
      timeline: "1 week delivery",
      gradient: "from-blue-500 to-purple-500",
      popular: false,
    },
    {
      icon: <FiCode className="text-white text-3xl" />,
      title: "MVP Web App",
      description: "Full-stack applications with authentication, database, and API integration. Perfect for validating your product idea quickly.",
      features: [
        "User authentication (email/password, OAuth)",
        "Database setup and schema design",
        "RESTful API or GraphQL endpoints",
        "Payment integration (Stripe, PayPal)",
        "Admin dashboard with user management",
        "Email notifications and basic automation",
        "Deployment and hosting setup",
      ],
      priceRange: "$2,000–$8,000",
      timeline: "2–4 weeks delivery",
      gradient: "from-nodelo-500 to-nodelo-400",
      popular: true,
    },
    {
      icon: <FiCpu className="text-white text-3xl" />,
      title: "dApp + Contract",
      description: "Blockchain applications with smart contracts and decentralized architecture. Built for Web3 and DeFi solutions.",
      features: [
        "Smart contract development (Solidity/Rust)",
        "Frontend with Web3 integration",
        "Wallet connection (MetaMask, WalletConnect)",
        "Security audit checklist and best practices",
        "Testnet deployment and testing",
        "Gas optimization strategies",
        "Documentation and deployment guides",
      ],
      priceRange: "$3,500–$15,000",
      timeline: "2–6 weeks delivery",
      gradient: "from-purple-500 to-pink-500",
      popular: false,
    },
    {
      icon: <FiSettings className="text-white text-3xl" />,
      title: "Support & Ops",
      description: "Ongoing maintenance, monitoring, and support for your applications. Keep everything running smoothly after launch.",
      features: [
        "24/7 uptime monitoring and alerts",
        "Regular backups and security updates",
        "Bug fixes and patches",
        "Performance optimization",
        "SLA with guaranteed response times",
        "Monthly health reports",
        "Feature enhancements (optional)",
      ],
      priceRange: "$200–$1,500/mo",
      timeline: "Ongoing",
      gradient: "from-green-500 to-teal-500",
      popular: false,
    },
  ]

  const includedFeatures = [
    {
      icon: FiZap,
      title: "Fast Delivery",
      description: "Fixed timelines with regular updates throughout the project. We stick to our deadlines.",
      color: "bg-nodelo-500",
    },
    {
      icon: FiShield,
      title: "Clean Code",
      description: "Well-documented, maintainable code following industry best practices and modern standards.",
      color: "bg-nodelo-400",
    },
    {
      icon: FiFileText,
      title: "Documentation",
      description: "Complete setup guides, API documentation, and deployment instructions for your team.",
      color: "bg-nodelo-500",
    },
    {
      icon: FiTrendingUp,
      title: "Scalable Architecture",
      description: "Built to grow with your business, from MVP to handling millions of users.",
      color: "bg-nodelo-400",
    },
  ]

  const faqs = [
    {
      question: "How do I choose the right service?",
      answer:
        "If you need a simple website (landing page, portfolio, small business site), choose Starter Site. For web applications with user accounts, databases, and complex features, go with MVP Web App. If you're building on blockchain, select dApp + Contract. Not sure? Contact us for a free consultation.",
    },
    {
      question: "What if my project doesn't fit these packages?",
      answer:
        "These are starting points. We customize every project to your specific needs. Get in touch with your requirements, and we'll provide a tailored quote and timeline.",
    },
    {
      question: "What happens after project delivery?",
      answer:
        "You receive full code ownership, documentation, and deployment guides. We offer optional Support & Ops plans for ongoing maintenance, or we can handle one-off updates and feature additions as needed.",
    },
    {
      question: "Do you provide hosting and domain setup?",
      answer:
        "Yes! We can handle deployment, hosting setup, and domain configuration. This is typically included in MVP and dApp packages, and can be added to Starter Site projects.",
    },
    {
      question: "Can you work with existing codebases?",
      answer:
        "Absolutely. We can enhance, refactor, or extend existing applications. Whether you need new features, performance improvements, or a complete overhaul, we can help.",
    },
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
                <FiZap className="text-nodelo-500" />
                <span className="text-sm font-medium text-nodelo-100">Our Services</span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Build your solution, <span className="text-transparent bg-clip-text bg-gradient-to-r from-nodelo-500 to-nodelo-400">your way</span>
              </h1>

              <p className="text-xl md:text-2xl text-nodelo-100 mb-8 leading-relaxed">
                From simple websites to complex applications and blockchain solutions. We design, build, and ship production-ready software tailored to your needs.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/contact" variant="primary" ariaLabel="Get a free quote">
                  Get a free quote
                </CTAButton>
                <CTAButton href="/#services" variant="ghost" ariaLabel="View portfolio">
                  View portfolio
                </CTAButton>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 bg-linear-to-b from-white to-nodelo-100">
          <div className="container-nodelo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                Choose your package
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                Every project includes clean code, documentation, and deployment support
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.title}
                  icon={service.icon}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  priceRange={service.priceRange}
                  timeline={service.timeline}
                  popular={service.popular}
                  gradient={service.gradient}
                />
              ))}
            </div>
          </div>
        </section>

        {/* What's Included Section */}
        <section ref={includedRef} className="py-20 bg-white">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={includedInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                What's included in every project
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                We don't cut corners. Every project comes with these essentials
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {includedFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={includedInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-6 bg-nodelo-100 rounded-2xl border border-nodelo-400/20 hover:border-nodelo-400/40 hover:shadow-xl transition-all duration-300">
                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-nodelo-900">{feature.title}</h3>
                    <p className="text-text/80 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section ref={processRef} className="py-20 bg-nodelo-100">
          <div className="container-nodelo max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                How we work
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                A transparent process from initial conversation to launch
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-nodelo-500 to-nodelo-400 hidden md:block" />

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
                {[
                  {
                    number: "01",
                    title: "Discovery",
                    description: "We discuss your goals, scope the project, and create a detailed proposal.",
                    icon: FiZap,
                  },
                  {
                    number: "02",
                    title: "Design & Plan",
                    description: "We design the UX/UI, plan the architecture, and set up the project structure.",
                    icon: FiLayout,
                  },
                  {
                    number: "03",
                    title: "Build & Test",
                    description: "We build your solution with regular updates, testing, and quality checks.",
                    icon: FiCode,
                  },
                  {
                    number: "04",
                    title: "Launch",
                    description: "We deploy to production, provide documentation, and hand over the code.",
                    icon: FiCheck,
                  },
                ].map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={processInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.15 }}
                    className="relative"
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-nodelo-400/20 hover:shadow-xl transition-all duration-300">
                      <div className="absolute -top-3 left-6 bg-gradient-to-r from-nodelo-500 to-nodelo-400 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {step.number}
                      </div>

                      <div className="w-12 h-12 bg-nodelo-100 rounded-xl flex items-center justify-center mb-4 mt-4">
                        <step.icon className="text-nodelo-500 text-xl" />
                      </div>

                      <h3 className="text-lg font-semibold mb-2 text-nodelo-900">{step.title}</h3>
                      <p className="text-text/80 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section ref={faqRef} className="py-20 bg-white">
          <div className="container-nodelo max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={faqInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                Frequently asked questions
              </h2>
              <p className="text-lg text-text/80">
                Common questions about our services
              </p>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.details
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={faqInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <summary className="flex items-center justify-between p-6 bg-nodelo-100 rounded-xl cursor-pointer hover:bg-nodelo-100/80 transition-colors">
                    <h3 className="text-lg font-semibold text-nodelo-900 pr-4">{faq.question}</h3>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 group-open:rotate-180 transition-transform duration-300">
                      <FiArrowRight className="rotate-90" />
                    </div>
                  </summary>
                  <div className="px-6 pb-6 pt-4">
                    <p className="text-text/80 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.details>
              ))}
            </div>
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
                Ready to start your project?
              </h2>
              <p className="text-xl text-nodelo-100 mb-10 max-w-2xl mx-auto">
                Get a free consultation and detailed quote. We'll help you choose the right solution and create a plan that fits your timeline and budget.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/contact" variant="primary" ariaLabel="Get a free quote" className="group">
                  <span className="flex items-center gap-2">
                    Get a free quote
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CTAButton>
                <CTAButton href="/about" variant="ghost" ariaLabel="Learn more about us">
                  Learn more about us
                </CTAButton>
              </div>

              <p className="mt-8 text-sm text-nodelo-100/80">
                No commitment required • Free consultation • Quote in 24 hours
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
