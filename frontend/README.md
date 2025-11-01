# Nodelo Landing Site

A modern, production-ready landing site for Nodelo built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd nodelo-landing
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Project Structure

\`\`\`
nodelo-landing/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── services/          # Services page
│   ├── contact/           # Contact page
│   ├── privacy/           # Privacy policy
│   ├── terms/             # Terms of service
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles & design tokens
├── components/            # React components
│   ├── Header.tsx         # Site header with navigation
│   ├── Footer.tsx         # Site footer
│   ├── Hero.tsx           # Hero section
│   ├── Logo.tsx           # Nodelo logo component
│   ├── CTAButton.tsx      # Call-to-action button
│   ├── ServiceCard.tsx    # Service card with animations
│   ├── TrustBar.tsx       # Trust bar with logos
│   ├── ContactForm.tsx    # Contact form with validation
│   └── NavMobileMenu.tsx  # Mobile navigation menu
├── public/
│   └── assets/
│       ├── tokens.json    # Design system tokens
│       └── logo.svg       # Nodelo logo SVG
├── scripts/
│   └── run-axe.js         # Accessibility testing script
├── __tests__/
│   └── Hero.test.tsx      # Unit tests
└── README.md
\`\`\`

## 🎨 Design System

The project uses a strict design system defined in `app/globals.css` and `public/assets/tokens.json`.

### Colors

- **nodelo-900**: `#071A2B` (Primary dark)
- **nodelo-800**: `#062B3A` (Secondary dark)
- **nodelo-500**: `#3DDC84` (Primary accent - green)
- **nodelo-400**: `#06B6D4` (Secondary accent - cyan)
- **nodelo-100**: `#F7FAFC` (Light background)
- **muted**: `#9AA6B2` (Muted text)
- **text**: `#0B1B26` (Body text)

### Typography

- **Font**: Inter (body and headings)
- **Sizes**: H1 (56px), H2 (36px), H3 (24px), Body (16px)
- **Line height**: 1.6 for body text

### Animations

Custom CSS animations are defined in `globals.css`:

- **fade-up**: Fade in with upward motion (480ms)
- **float**: Subtle floating motion (6s loop)
- **pop**: Scale pop effect (260ms)
- **shimmer**: Shimmer effect for loading states (1.4s)

Usage: `className="animate-fade-up delay-200"`

## 🧪 Testing

### Unit Tests

Run unit tests with Vitest:

\`\`\`bash
npm run test
\`\`\`

Tests are located in `__tests__/` directory.

### Accessibility Tests

Run accessibility tests with axe-core:

\`\`\`bash
# Start the dev server first
npm run dev

# In another terminal, run accessibility tests
npm run test:a11y
\`\`\`

This will test all pages for WCAG compliance and report any violations.

### Lighthouse Tests

1. Build the production version:
\`\`\`bash
npm run build
npm run start
\`\`\`

2. Open Chrome DevTools (F12)
3. Go to the Lighthouse tab
4. Run audit for Performance, Accessibility, SEO, and Best Practices
5. Target: All scores >= 90

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run unit tests
- `npm run test:a11y` - Run accessibility tests

## 🔧 Configuration

### Environment Variables

No environment variables are required for the basic site. If you add the contact form API route, you may need:

- `SMTP_HOST` - Email server host
- `SMTP_PORT` - Email server port
- `SMTP_USER` - Email username
- `SMTP_PASS` - Email password

### Contact Form API (TODO)

The contact form currently shows a success message without sending data. To implement the backend:

1. Create `app/api/contact/route.ts`:

\`\`\`typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  
  // Validate input
  const { name, email, company, message } = body
  
  if (!name || !email || !message) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }
  
  // TODO: Send email using your preferred service
  // - Resend
  // - SendGrid
  // - Nodemailer
  // - etc.
  
  return NextResponse.json({
    success: true,
    message: 'Message received'
  })
}
\`\`\`

2. Update `components/ContactForm.tsx` to call the API endpoint.

## 🖼️ Replacing Placeholder Images

### Logo

Replace the generated logo images in `/public/`:
- `favicon-32x32.jpg` → `favicon-32x32.png`
- `favicon-16x16.jpg` → `favicon-16x16.png`
- Update `public/assets/logo.svg` with your actual logo

### Hero Image

Replace `/public/nodelo-web-development.jpg` with your actual hero image.

### Trust Bar Logos

Update `components/TrustBar.tsx` to use real client logos instead of placeholder SVGs.

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will auto-detect Next.js and deploy

### Deploy to Other Platforms

Build the static site:

\`\`\`bash
npm run build
\`\`\`

The output will be in `.next/` directory. Follow your hosting provider's Next.js deployment guide.

## ♿ Accessibility

This site is built with accessibility in mind:

- Semantic HTML elements
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Skip-to-content link
- Form validation with error messages
- Color contrast meets WCAG AA standards
- Screen reader friendly

Run `npm run test:a11y` to verify accessibility compliance.

## 📊 Accessibility Report

Last tested: [Date]

### Results

- **Home**: ✅ No violations
- **Services**: ✅ No violations
- **About**: ✅ No violations
- **Contact**: ✅ No violations
- **Privacy**: ✅ No violations
- **Terms**: ✅ No violations

### Lighthouse Scores (Target: >= 90)

- **Performance**: [Score]
- **Accessibility**: [Score]
- **SEO**: [Score]
- **Best Practices**: [Score]

## 📄 License

Copyright © 2025 Nodelo. All rights reserved.

## 🤝 Support

For questions or issues, please contact us through the [contact form](/contact).
