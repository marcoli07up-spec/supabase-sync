# AI Development Rules - iCamStore

## Tech Stack
- **Framework**: React 18 with TypeScript and Vite.
- **Styling**: Tailwind CSS for utility-first, responsive design.
- **UI Components**: shadcn/ui (Radix UI primitives) for accessible components.
- **Backend/Database**: Supabase (PostgreSQL, Auth, Storage, Edge Functions).
- **State Management**: TanStack Query (React Query) for server state; React Context for global UI state (e.g., Cart).
- **Routing**: React Router DOM for client-side navigation.
- **Icons**: Lucide React for consistent iconography.
- **Forms**: React Hook Form with Zod for schema-based validation.
- **Notifications**: Sonner for toast notifications.

## Development Rules

### 1. Component Architecture
- **Location**: All UI components must reside in `src/components/`.
- **Granularity**: Keep components small and focused (ideally under 100 lines).
- **shadcn/ui**: Always check `src/components/ui/` before creating a new base component. Use existing shadcn primitives.
- **Naming**: Use PascalCase for component files (e.g., `ProductCard.tsx`).

### 2. Page Structure
- **Location**: All route-level components must reside in `src/pages/`.
- **Layout**: Wrap page content in the `Layout` component from `src/components/layout`.

### 3. Data Fetching & State
- **Server State**: Use TanStack Query for all API calls. Wrap queries and mutations in custom hooks within `src/hooks/`.
- **Supabase**: Use the client from `@/integrations/supabase/client`. Do not initialize new clients.
- **Global State**: Use React Context in `src/contexts/` only for state that truly needs to be global (e.g., Shopping Cart).

### 4. Styling & Design
- **Tailwind**: Use Tailwind classes exclusively for styling. Avoid writing custom CSS in `index.css` unless defining theme variables.
- **Responsive**: Every component must be mobile-first and fully responsive.
- **Theme**: Adhere to the Yellow/Black brand theme defined in `index.css`.

### 5. Forms & Validation
- **Validation**: Use Zod schemas to define form structures and validation rules.
- **Implementation**: Use React Hook Form for managing form state and errors.

### 6. Icons & Assets
- **Icons**: Use `lucide-react`.
- **Images**: Use the `public/` folder for static assets or Supabase Storage for dynamic product images.

### 7. Best Practices
- **Type Safety**: Always define interfaces for props and data structures in `src/types/index.ts`.
- **Formatting**: Use `formatCurrency` and other utilities from `src/lib/format.ts` for consistent data display.
- **Toasts**: Use `toast` from `sonner` for user feedback on actions (success/error).