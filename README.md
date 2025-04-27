# Premier Inn Booking Application

A Next.js application fora group hotel booking

**Demo:** [https://premier-inn.vercel.app/en](https://premier-inn.vercel.app/en)

## Requirements

- Node.js >= 18
- npm, yarn, pnpm, or bun

## Setup & Run Instructions

```bash
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

Access the application at [http://localhost:3000](http://localhost:3000)

## Deployment

The application is deployed on Vercel, which provides:

- Automatic deployments on push to the main branch
- Preview deployments for pull requests
- Edge Network CDN for optimized global delivery

## Architecture & Technical Decisions

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 with Tailwind CSS
- **Form Management**: React Hook Form with Zod validation
- **Internationalization**: next-intl for multi-language support (English, German)
- **Testing**: Jest for unit tests, Playwright for e2e testing
- **Date Management**: React Datepicker for date selection

### Key Components

- Multi-step booking form with validation
- Hotel search with autocomplete
- Responsive design with collapsible sections

## Trade-offs & Considerations

- Used client-side validation for immediate feedback, with server-side validation as a backup
- Adopted a component-based architecture for reusability and maintainability
- Implemented progressive disclosure in the booking form UI to reduce cognitive load

## Testing & Validation

```bash
# Run unit tests
npm run test

# Watch mode for unit tests
npm run test:watch

# Test coverage report
npm run test:coverage

# Run e2e tests
npm run e2e

# Run e2e tests with UI
npm run e2e:ui

# Run e2e tests in debug mode
npm run e2e:debug

# View e2e test report
npm run e2e:report

# Lint code
npm run lint
```

## Performance & Accessibility

- Implements responsive design for all screen sizes
- Uses semantic HTML elements for better accessibility
- Optimized load times with Next.js image optimization
- Form validation includes appropriate ARIA attributes
