import Header from "@/components/Header"
import Footer from "@/components/Footer"

export const metadata = {
  title: "Privacy Policy — Nodelo",
  description: "Nodelo's privacy policy and data handling practices.",
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <section className="py-20 bg-white">
          <div className="container-nodelo max-w-4xl">
            <h1 className="mb-8">Privacy Policy</h1>
            <div className="space-y-6 text-text leading-relaxed">
              <p className="text-muted">Last updated: {new Date().toLocaleDateString()}</p>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p>
                  This privacy policy describes how Nodelo collects, uses, and protects your personal information when
                  you use our website and services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as when you fill out a contact form, request a
                  quote, or communicate with us. This may include your name, email address, company name, and project
                  details.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 mt-4 ml-4">
                  <li>Respond to your inquiries and provide customer support</li>
                  <li>Send you project proposals and quotes</li>
                  <li>Communicate about your projects and services</li>
                  <li>Improve our website and services</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal information
                  against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy, please contact us through our{" "}
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
