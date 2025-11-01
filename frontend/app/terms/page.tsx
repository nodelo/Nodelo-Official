import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Terms of Service — Nodelo",
  description: "Nodelo's terms of service and conditions.",
}

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="py-20 bg-white">
          <div className="container-nodelo max-w-4xl">
            <h1 className="mb-8">Terms of Service</h1>
            <div className="space-y-6 text-text leading-relaxed">
              <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
                <p>
                  By accessing or using Nodelo's services, you agree to be bound by these Terms of Service. If you
                  disagree with any part of these terms, you may not access our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Services</h2>
                <p>
                  Nodelo provides web development services including but not limited to website design, web application
                  development, smart contract development, and ongoing support and maintenance.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Project Terms</h2>
                <p>
                  Each project will be governed by a separate project agreement that outlines the scope, timeline,
                  deliverables, and payment terms. The project agreement will take precedence over these general terms
                  for project-specific matters.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
                <p>
                  Upon full payment, you will own all rights to the final deliverables created specifically for your
                  project. Nodelo retains the right to use general techniques, methodologies, and non-proprietary code
                  in future projects.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
                <p>
                  Nodelo shall not be liable for any indirect, incidental, special, consequential, or punitive damages
                  resulting from your use of our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <p>
                  For questions about these terms, please contact us through our{" "}
                  <a href="/contact" className="text-nodelo-500 hover:underline">
                    contact form
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
