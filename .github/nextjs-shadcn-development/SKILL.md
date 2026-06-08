---
name: nextjs-shadcn-development
description: 'Comprehensive guide for building premium frontend UI with Next.js 16, React 19, and shadcn components. Includes best practices, component patterns, and quality assurance workflows.'
metadata:
  author: 'AI Assistant'
  compatible: 'Next.js 16.2.7+, React 19.2.4+, shadcn 4.11.0+'
---

# Next.js + shadcn Frontend Development

This skill provides guidelines for crafting high-quality frontend components using Next.js 16, React 19, and shadcn/ui components. Follow these principles to maintain code quality, accessibility, and performance across the project.

---

## 1. Component Architecture & Best Practices

### 1.1 File Structure
Organize components following this hierarchy:
```
components/
├── ui/                          # shadcn base components
│   ├── button.tsx
│   ├── card.tsx
│   └── [component].tsx
├── features/                    # Feature-specific components
│   ├── hero/
│   ├── navigation/
│   └── [feature]/
└── layout/                      # Layout components
    ├── header.tsx
    ├── footer.tsx
    └── sidebar.tsx
```

### 1.2 Component Patterns
- **Use React 19 features**: Leverage Server Components by default; use `'use client'` only when necessary.
- **Type-safety first**: Always use TypeScript interfaces for props. Avoid `any` types.
- **Prop composition**: Extend shadcn components using composition over wrapper components when possible.

Example pattern:
```typescript
'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';

const customButtonVariants = cva('', {
  variants: {
    // Your custom variants here
  },
});

interface CustomButtonProps extends ButtonProps, VariantProps<typeof customButtonVariants> {
  isLoading?: boolean;
}

export function CustomButton({ isLoading, ...props }: CustomButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading ? 'Loading...' : props.children}
    </Button>
  );
}
```

---

## 2. Styling with Tailwind CSS & shadcn

### 2.1 Utility-First CSS
- Use Tailwind CSS utility classes directly in JSX.
- Leverage `clsx` and `tailwind-merge` for conditional class composition.
- Avoid custom CSS files unless unavoidable; use `@apply` in globals.css sparingly.

### 2.2 Theme Customization
- Customize shadcn themes via `components.json` and CSS variables.
- Maintain consistent spacing, colors, and typography scales.
- Use CSS custom properties for dynamic theming (light/dark mode).

Example theme variables (in `globals.css`):
```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --primary: 0 0% 9%;
    --primary-foreground: 0 0% 98%;
    /* Additional theme variables */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --background: 0 0% 3.6%;
      --foreground: 0 0% 98%;
      /* Dark mode overrides */
    }
  }
}
```

---

## 3. Accessibility Standards

### 3.1 WCAG Compliance
- Always include semantic HTML: use `<button>`, `<a>`, `<form>` appropriately.
- shadcn components are built with accessibility in mind; respect their APIs.
- Test keyboard navigation: all interactive elements must be keyboard-accessible.

### 3.2 ARIA Attributes
- Use `aria-label`, `aria-describedby`, and `aria-live` regions for dynamic content.
- Always include `alt` text for images.
- Test with screen readers (e.g., NVDA, JAWS).

### 3.3 Motion & Animations
- Respect `prefers-reduced-motion` media query.
- Keep animations purposeful and performant.

```typescript
export function AnimatedComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: prefer-reduced)');

  return (
    <div className={prefersReducedMotion ? '' : 'animate-fade-in'}>
      {/* Content */}
    </div>
  );
}
```

---

## 4. Performance Optimization

### 4.1 Server Components
- Default to Server Components to reduce JavaScript bundle size.
- Fetch data directly in Server Components rather than Client Components.
- Use `React.lazy()` and `Suspense` for code splitting when necessary.

### 4.2 Image Optimization
- Always use Next.js `Image` component for automatic optimization.
- Specify `width`, `height`, and `placeholder` props.
- Use `loading="lazy"` for below-fold images.

```typescript
import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/hero-image.jpg"
      alt="Hero section"
      width={1200}
      height={600}
      priority
      placeholder="blur"
      blurDataURL="data:image/svg+xml;base64,..."
    />
  );
}
```

### 4.3 Bundle Size Management
- Use dynamic imports for heavy dependencies.
- Tree-shake unused exports.
- Monitor bundle size regularly with `next/bundle-analyzer`.

---

## 5. Type Safety with TypeScript

### 5.1 Strict Mode
- Always run TypeScript in strict mode (`tsconfig.json`).
- Fix all type errors; avoid `@ts-ignore` comments unless absolutely necessary.

### 5.2 Common Patterns
Define reusable types for consistency:
```typescript
// types/index.ts
export type StatusType = 'idle' | 'loading' | 'success' | 'error';

export interface ApiResponse<T = unknown> {
  data: T;
  status: StatusType;
  message?: string;
}

export type ApiEndpoint<T = unknown> = (
  params?: Record<string, any>
) => Promise<ApiResponse<T>>;
```

---

## 6. Quality Assurance Workflow

### 6.1 Pre-commit Checklist
Before committing changes, run the quality assurance suite:

```bash
# 1. Lint code for style and best practice violations
pnpm lint

# 2. Type-check entire project
pnpm typecheck

# 3. Build for production to catch runtime errors
pnpm build
```

### 6.2 Integration with Development
Wrap these checks into your workflow:
- Run during development to catch issues early.
- Run before pushing to catch regressions.
- Run in CI/CD pipelines to block merge of failing code.

### 6.3 IDE Integration
- Configure your IDE (VS Code) to lint and format on save.
- Use ESLint and Prettier extensions to catch issues in real-time.

---

## 7. Common Issues & Solutions

### 7.1 Missing TypeScript Types
**Problem**: "Cannot find module or corresponding type"
**Solution**: 
- Ensure all dependencies have `@types` packages installed.
- Check `tsconfig.json` includes/excludes paths.
- Run `tsc --noEmit` to check for type errors.

### 7.2 Styling Not Applied
**Problem**: Tailwind classes not showing in production build
**Solution**:
- Verify `tailwind.config.ts` includes all template paths.
- Check component files are in the content paths.
- Rebuild and clear `.next` cache if needed.

### 7.3 Component Not Rendering
**Problem**: Component renders in dev but not in production build
**Solution**:
- Ensure dynamic imports have `loading` fallbacks.
- Check Server Component boundaries (avoid Client Components in Server Components without `'use client'` markers).
- Run `next build` to simulate production build locally.

---

## 8. Recommended Tools & Extensions

### VS Code Extensions
- **ESLint**: Real-time linting feedback
- **Tailwind CSS IntelliSense**: Auto-completion for Tailwind classes
- **TypeScript Vue Plugin**: Enhanced TypeScript support (if using Vue components)
- **Prettier**: Code formatting

### Development Tools
- **pnpm**: Fast, disk space-efficient package manager
- **next/bundle-analyzer**: Monitor bundle size
- **Chrome DevTools**: Performance profiling

---

## 9. Quick Reference: Common Tasks

| Task | Command |
|------|---------|
| Start development server | `pnpm dev` |
| Build for production | `pnpm build` |
| Run ESLint | `pnpm lint` |
| Type-check (if script exists) | `pnpm typecheck` |
| Start production server | `pnpm start` |

---

## Summary

When developing with Next.js and shadcn:
1. **Structure** components logically and maintain strict TypeScript types.
2. **Style** using Tailwind utilities with class composition utilities.
3. **Optimize** performance with Server Components and lazy loading.
4. **Test** accessibility and responsiveness across browsers and devices.
5. **Validate** code quality by running lint, typecheck, and build checks before committing.
6. **Document** component APIs and props using JSDoc comments.
