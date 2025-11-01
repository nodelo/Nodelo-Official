import { chromium } from "playwright"
import { injectAxe, getViolations } from "axe-playwright"

const pages = [
  { url: "http://localhost:3000", name: "Home" },
  { url: "http://localhost:3000/services", name: "Services" },
  { url: "http://localhost:3000/about", name: "About" },
  { url: "http://localhost:3000/contact", name: "Contact" },
  { url: "http://localhost:3000/privacy", name: "Privacy" },
  { url: "http://localhost:3000/terms", name: "Terms" },
]

async function runAccessibilityTests() {
  console.log("🔍 Starting accessibility tests with axe-core...\n")

  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  let totalViolations = 0
  const results = []

  for (const pageInfo of pages) {
    console.log(`Testing: ${pageInfo.name} (${pageInfo.url})`)

    try {
      await page.goto(pageInfo.url, { waitUntil: "networkidle" })
      await injectAxe(page)

      const violations = await getViolations(page)

      if (violations.length === 0) {
        console.log(`✅ ${pageInfo.name}: No accessibility violations found\n`)
        results.push({ page: pageInfo.name, violations: 0, issues: [] })
      } else {
        console.log(`❌ ${pageInfo.name}: ${violations.length} violation(s) found`)
        violations.forEach((violation) => {
          console.log(`  - ${violation.id}: ${violation.description}`)
          console.log(`    Impact: ${violation.impact}`)
          console.log(`    Affected elements: ${violation.nodes.length}`)
        })
        console.log("")

        totalViolations += violations.length
        results.push({
          page: pageInfo.name,
          violations: violations.length,
          issues: violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
          })),
        })
      }
    } catch (error) {
      console.error(`❌ Error testing ${pageInfo.name}:`, error.message)
      console.log("")
    }
  }

  await browser.close()

  console.log("=".repeat(60))
  console.log("📊 Accessibility Test Summary")
  console.log("=".repeat(60))
  console.log(`Total pages tested: ${pages.length}`)
  console.log(`Total violations found: ${totalViolations}`)
  console.log("")

  results.forEach((result) => {
    console.log(`${result.page}: ${result.violations} violation(s)`)
  })

  console.log("\n" + "=".repeat(60))

  if (totalViolations === 0) {
    console.log("✅ All pages passed accessibility tests!")
  } else {
    console.log("⚠️  Some pages have accessibility issues that need attention.")
  }

  process.exit(totalViolations > 0 ? 1 : 0)
}

runAccessibilityTests().catch((error) => {
  console.error("Fatal error:", error)
  process.exit(1)
})
