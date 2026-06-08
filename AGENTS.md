<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Available Skills

This project includes specialized skills for frontend development:

### 1. **nextjs-shadcn-development**
Comprehensive guide for building premium frontend UI with Next.js 16, React 19, and shadcn components.

**When to use**: Creating components, pages, or any frontend features
**Key topics**:
- Component architecture and file structure
- Type-safe component patterns
- Tailwind CSS styling and theme customization
- Accessibility (WCAG) standards
- Performance optimization with Server Components
- Quality assurance workflow

### 2. **premium-frontend-ui**
Advanced guide for crafting immersive, high-performance web experiences with motion, typography, and architectural craftsmanship.

**When to use**: Building landing pages, interactive portfolios, or award-level visual designs
**Key topics**:
- Entry sequences and preloaders
- Hero architecture and depth design
- Scroll-driven narratives with GSAP
- High-fidelity micro-interactions
- Advanced typography and lighting effects
- Performance guardrails for animations

## Quality Assurance Commands

Before committing major changes, run the complete QA workflow:

```bash
# Run all checks
pnpm qa

# Or run individually:
pnpm lint          # Check code style and best practices
pnpm typecheck      # Verify TypeScript types
pnpm build          # Build for production
```

See [.instructions.md](.instructions.md) for detailed QA workflow documentation.

