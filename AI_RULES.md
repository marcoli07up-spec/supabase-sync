# AI Development Rules - iCamStore

## Tech Stack
- **Vite + React + TypeScript**: Core framework for a fast, type-safe development experience.
- **Tailwind CSS**: Utility-first CSS framework for all styling needs.
- **shadcn/ui**: Accessible and customizable UI components built on top of Radix UI.
- **Supabase**: Backend-as-a-Service for Database (PostgreSQL), Authentication, Storage, and Edge Functions.
- **React Router (v6)**: Client-side routing for single-page application navigation.
- **TanStack Query (React Query)**: Server state management, caching, and data fetching.
- **Lucide React**: Standard library for all iconography.
- **Sonner**: Modern toast notification system for user feedback.
- **Embla Carousel**: Lightweight carousel library for banners and product sliders.

## Library Usage Rules
- **Styling**: Always use Tailwind CSS classes. Avoid inline styles or CSS modules unless absolutely necessary for complex animations.
- **UI Components**: Prioritize using existing `shadcn/ui` components located in `src/components/ui/`. If a new component is needed, check if it exists in shadcn/ui before building from scratch.
- **Icons**: Use `lucide-react` for all icons to maintain visual consistency.
- **Data Fetching**: Use custom hooks in `src/hooks/` that utilize `useQuery` or `useMutation` from TanStack Query. Do not use `useEffect` for data fetching.
- **State Management**: Use React Context for global UI state (like the Cart) and TanStack Query for server-side state.
- **Notifications**: Use `sonner` (via `toast`) for all user-facing alerts and success/error messages.
- **Forms**: Use `react-hook-form` combined with `zod` for form validation and management.

## Project Structure Guidelines
- **Pages**: All route-level components must reside in `src/pages/`.
- **Components**: Reusable UI elements go in `src/components/`, organized by feature (e.g., `src/components/cart/`, `src/components/products/`).
- **Hooks**: All data fetching and complex logic should be extracted into custom hooks in `src/hooks/`.
- **Utilities**: Helper functions, formatters, and constants should be placed in `src/lib/`.
- **Types**: Shared TypeScript interfaces and types should be defined in `src/types/index.ts`.
- **Routing**: Keep all route definitions centralized in `src/App.tsx`.