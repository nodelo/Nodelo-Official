"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Hero from "@/components/Hero"
import TrustBar from "@/components/TrustBar"
import CTAButton from "@/components/CTAButton"
import { 
  FiCode, FiLayout, FiDatabase, FiShield, FiZap, FiTrendingUp,
  FiCheck, FiArrowRight, FiMessageCircle, FiStar, FiGlobe,
  FiSmartphone, FiServer, FiLock, FiUsers, FiCpu
} from "react-icons/fi"
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs, SiPython } from "react-icons/si"

export default function HomePage() {
  const { ref: servicesRef, inView: servicesInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: processRef, inView: processInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: techRef, inView: techInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: testimonialsRef, inView: testimonialsInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const { ref: faqRef, inView: faqInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  })

  const services = [
    {
      icon: FiLayout,
      title: "Starter Site",
      description: "Perfect for businesses needing a professional web presence quickly.",
      price: "$300–$900",
      timeline: "1 week delivery",
      features: ["2–4 pages", "SEO optimized", "Responsive design", "Contact forms"],
      popular: false,
      gradient: "from-blue-500 to-purple-500",
    },
    {
      icon: FiCode,
      title: "MVP Web App",
      description: "Full-featured web applications with user authentication and data management.",
      price: "$2,000–$8,000",
      timeline: "2–4 weeks delivery",
      features: ["Authentication", "API integration", "Database setup", "Admin panel"],
      popular: true,
      gradient: "from-nodelo-500 to-nodelo-400",
    },
    {
      icon: FiCpu,
      title: "dApp + Contract",
      description: "Blockchain-powered applications with smart contract integration.",
      price: "$3,500–$15,000",
      timeline: "2–6 weeks delivery",
      features: ["Smart contracts", "Web3 integration", "Audit checklist", "Gas optimization"],
      popular: false,
      gradient: "from-purple-500 to-pink-500",
    },
  ]

  const features = [
    {
      icon: FiZap,
      title: "Strategic discovery",
      description: "We clarify goals, scope, and success metrics before a single line of code is written.",
    },
    {
      icon: FiShield,
      title: "Senior engineering",
      description: "Experienced designers and engineers build with best practices, testing, and documentation.",
    },
    {
      icon: FiSmartphone,
      title: "Thoughtful UX/UI",
      description: "Clean, accessible interfaces that feel fast and work beautifully across devices.",
    },
    {
      icon: FiServer,
      title: "Scalable by design",
      description: "Modern architectures ready for growth—APIs, databases, and infra you can trust.",
    },
    {
      icon: FiLock,
      title: "Ownership & transparency",
      description: "You own 100% of the code and assets. Clear communication and weekly updates.",
    },
    {
      icon: FiUsers,
      title: "Post‑launch partnership",
      description: "Support, maintenance, and iteration plans to help you keep shipping value.",
    },
  ]

  const technologies = [
    { icon: SiReact, name: "React", color: "text-blue-500" },
    { icon: SiNextdotjs, name: "Next.js", color: "text-black" },
    { icon: SiTypescript, name: "TypeScript", color: "text-blue-600" },
    { icon: SiTailwindcss, name: "Tailwind", color: "text-cyan-500" },
    { icon: SiNodedotjs, name: "Node.js", color: "text-green-600" },
    { icon: SiPython, name: "Python", color: "text-yellow-600" },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "CEO, TechStartup",
      content: "Nodelo delivered our MVP in just 3 weeks. The code quality was exceptional, and their process kept us aligned and moving quickly.",
      rating: 5,
      image: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Founder, FinanceApp",
      content: "We needed a complex financial dashboard built quickly. Nodelo not only delivered on time but also suggested improvements that made our product better.",
      rating: 5,
      image: "MR",
    },
    {
      name: "Emily Watson",
      role: "Product Manager, HealthTech",
      content: "The attention to detail and user experience was outstanding. Our users love the intuitive interface, and we've seen a 40% increase in engagement.",
      rating: 5,
      image: "EW",
    },
  ]

  const faqs = [
    {
      question: "How do we get started?",
      answer: "Send us a short brief or message about what you want to build. We’ll jump on a call, clarify scope and success criteria, then provide a proposal with timeline and fixed pricing options.",
    },
    {
      question: "Do I own the code?",
      answer: "Yes. You own 100% of the code, designs, and assets. We deliver documentation and handover notes so your team can run with it at any time.",
    },
    {
      question: "What timelines should I expect?",
      answer: "Starter sites ship in about a week. MVPs typically take 2–4 weeks. Larger platforms vary based on scope—we’ll give you clear milestones and weekly updates.",
    },
    {
      question: "How do you handle pricing and payments?",
      answer: "We usually work on fixed-price phases with clearly defined deliverables. Payments are split by milestones so you always know where we are and what’s next.",
    },
    {
      question: "What happens after launch?",
      answer: "We offer support and maintenance plans, or we can continue as your product partner to iterate, improve performance, and ship new features.",
    },
  ]

  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <TrustBar />

        {/* Features Section */}
        <section ref={featuresRef} className="py-20 bg-gradient-to-b from-white to-nodelo-100">
          <div className="container-nodelo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={featuresInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                Why choose Nodelo?
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                A reliable product team to scope, design, build, and launch your solution
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-white rounded-2xl border border-nodelo-400/20 hover:border-nodelo-400/40 hover:shadow-xl transition-all duration-300">
                    <div className="w-14 h-14 bg-gradient-to-br from-nodelo-500 to-nodelo-400 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="text-white text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-nodelo-900">{feature.title}</h3>
                    <p className="text-text/80 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-20 bg-white">
          <div className="container-nodelo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={servicesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                Choose your perfect plan
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                From simple websites to complex applications, we have the right solution for your needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={servicesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="relative"
                >
                  <div className={`h-full p-8 rounded-2xl border-2 ${
                    service.popular 
                      ? "border-nodelo-500 shadow-xl shadow-nodelo-500/20" 
                      : "border-nodelo-400/20"
                  } hover:shadow-2xl transition-all duration-300 bg-white relative overflow-hidden group`}>
                    {/* Background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                    
                    {service.popular && (
                      <div className="absolute -top-1 -right-1">
                        <div className="bg-nodelo-500 text-white px-4 py-1 rounded-bl-xl rounded-tr-xl text-sm font-semibold">
                          Most Popular
                        </div>
                      </div>
                    )}

                    <div className="relative z-10">
                      <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-xl flex items-center justify-center mb-6`}>
                        <service.icon className="text-white text-3xl" />
                </div>

                      <h3 className="text-2xl font-bold mb-3 text-nodelo-900">{service.title}</h3>
                      <p className="text-text/80 mb-6">{service.description}</p>
                      
                      <div className="text-3xl font-bold text-nodelo-900 mb-2">{service.price}</div>
                      <div className="text-sm text-text/70 mb-6">{service.timeline}</div>

                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3">
                            <FiCheck className="text-nodelo-500 mt-0.5 flex-shrink-0" />
                            <span className="text-text">{feature}</span>
                  </li>
                        ))}
                </ul>

                      <CTAButton 
                        href="/services" 
                        variant={service.popular ? "primary" : "secondary"} 
                        className="w-full group"
                      >
                        <span className="flex items-center justify-center gap-2">
                  Learn more
                          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </span>
                </CTAButton>
              </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section ref={techRef} className="py-20 bg-nodelo-100">
          <div className="container-nodelo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={techInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-nodelo-900">
                Built with modern technologies
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                We use the latest tools and frameworks to ensure your project is fast, secure, and scalable
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={techInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="group cursor-pointer"
                >
                  <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center gap-2 border border-nodelo-400/20 group-hover:shadow-xl transition-all duration-300">
                    <tech.icon className={`text-4xl ${tech.color}`} />
                    <span className="text-xs font-medium text-text/70">{tech.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
                </div>
        </section>

        {/* Process Section */}
        <section ref={processRef} className="py-20 bg-white">
          <div className="container-nodelo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={processInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                Our proven process
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                From idea to launch in three simple steps
              </p>
            </motion.div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-nodelo-500 to-nodelo-400 hidden md:block" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                {[
                  {
                    number: "01",
                    title: "Discovery & Planning",
                    description: "We analyze your requirements, create a project roadmap, and provide a detailed quote with timelines.",
                    icon: FiMessageCircle,
                  },
                  {
                    number: "02",
                    title: "Development & Testing",
                    description: "Our product team designs, builds, and tests your application with weekly check‑ins and clear milestones.",
                    icon: FiCode,
                  },
                  {
                    number: "03",
                    title: "Launch & Support",
                    description: "We deploy your application, provide documentation, and offer ongoing support as you grow.",
                    icon: FiGlobe,
                  },
                ].map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={processInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    className="relative"
                  >
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-nodelo-400/20 hover:shadow-xl transition-all duration-300">
                      <div className="absolute -top-4 left-8 bg-gradient-to-r from-nodelo-500 to-nodelo-400 text-white px-4 py-2 rounded-full text-sm font-bold">
                        {step.number}
                </div>
                      
                      <div className="w-16 h-16 bg-nodelo-100 rounded-xl flex items-center justify-center mb-6 mt-4">
                        <step.icon className="text-nodelo-500 text-2xl" />
              </div>

                      <h3 className="text-xl font-semibold mb-3 text-nodelo-900">{step.title}</h3>
                      <p className="text-text/80 leading-relaxed">{step.description}</p>
                </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-20 bg-gradient-to-b from-nodelo-100 to-white">
          <div className="container-nodelo">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-nodelo-900">
                What our clients say
              </h2>
              <p className="text-lg text-text/80 max-w-2xl mx-auto">
                Don't just take our word for it - hear from businesses we've helped succeed
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className="group"
                >
                  <div className="h-full p-8 bg-white rounded-2xl shadow-lg border border-nodelo-400/20 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-nodelo-500 to-nodelo-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.image}
                      </div>
                      <div>
                        <h4 className="font-semibold text-nodelo-900">{testimonial.name}</h4>
                        <p className="text-sm text-text/70">{testimonial.role}</p>
                      </div>
            </div>

                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      ))}
              </div>

                    <p className="text-text/80 leading-relaxed italic">"{testimonial.content}"</p>
                </div>
                </motion.div>
              ))}
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
                Got questions? We've got answers
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
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center flex-shrink-0 group-open:rotate-180 transition-transform duration-300">
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
              rotate: [0, 5, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-10 left-10 w-20 h-20 bg-nodelo-500/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              y: [0, 20, 0],
              rotate: [0, -5, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
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
                Have a project in mind?
              </h2>
              <p className="text-xl text-nodelo-100 mb-10 max-w-2xl mx-auto">
                Tell us what you want to build and we’ll map the path to launch—clear scope, fixed pricing, and a reliable delivery plan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/contact" variant="primary" ariaLabel="Start your project today" className="group">
                  <span className="flex items-center gap-2">
                    Start your project
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </CTAButton>
                <CTAButton href="/services" variant="ghost" ariaLabel="View our services">
                  View services
            </CTAButton>
              </div>

              <p className="mt-8 text-sm text-nodelo-100/80">
                No commitment required • Get a timeline and quote in 24 hours
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}