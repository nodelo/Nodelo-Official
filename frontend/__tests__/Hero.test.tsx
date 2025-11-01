import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Hero from "@/components/Hero"

describe("Hero Component", () => {
  it("renders the main headline", () => {
    render(<Hero />)
    const headline = screen.getByRole("heading", { level: 1 })
    expect(headline).toHaveTextContent("Build product-grade apps. Fast.")
  })

  it("renders the subheadline", () => {
    render(<Hero />)
    expect(screen.getByText(/End-to-end web apps and polished frontends/i)).toBeInTheDocument()
  })

  it("renders both CTA buttons", () => {
    render(<Hero />)
    const getQuoteButton = screen.getByRole("link", { name: /get a quote/i })
    const servicesButton = screen.getByRole("link", { name: /our services/i })

    expect(getQuoteButton).toBeInTheDocument()
    expect(servicesButton).toBeInTheDocument()
    expect(getQuoteButton).toHaveAttribute("href", "/contact")
    expect(servicesButton).toHaveAttribute("href", "/services")
  })

  it("renders feature cards", () => {
    render(<Hero />)
    expect(screen.getByText("Production-Ready")).toBeInTheDocument()
    expect(screen.getByText("Fast Delivery")).toBeInTheDocument()
    expect(screen.getByText("Secure & Scalable")).toBeInTheDocument()
  })

  it("has proper semantic structure", () => {
    const { container } = render(<Hero />)
    const section = container.querySelector("section")
    expect(section).toBeInTheDocument()
  })
})
