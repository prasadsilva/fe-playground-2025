import ReactLogoSvg from '@/img/logos/react-logo.svg?no-inline'
import ViteLogoSvg from '@/img/logos/vite-logo.svg?no-inline'
import TailwindCssLogoSvg from '@/img/logos/tailwindcss-logo.svg?no-inline'
import ShadcnUiLogoSvg from '@/img/logos/shadcn-ui-logo.svg?no-inline'
import TanstackLogoPng from '@/img/logos/tanstack-logo.png'

export interface TechStackItemData {
    category: string,
    chosenStack: string,
    logoImg: string,
    url: string,
    description: string,
}

export const techStackItemsData: TechStackItemData[] = [
    {
        category: "UI Library",
        chosenStack: "React",
        logoImg: ReactLogoSvg,
        url: 'https://react.dev',
        description: 'A JavaScript library for building user interfaces by composing reusable components that manage their own state and efficiently update the DOM when data changes.'
    },
    {
        category: "Build Tool",
        chosenStack: "Vite",
        logoImg: ViteLogoSvg,
        url: 'https://vite.dev',
        description: 'A build tool and development server that provides fast startup and hot module replacement by using native ES modules and on-demand code compilation.'
    },
    {
        category: "Styling",
        chosenStack: "Tailwind CSS",
        logoImg: TailwindCssLogoSvg,
        url: 'https://tailwindcss.com',
        description: 'A utility-first CSS framework that provides low-level classes to build custom designs directly in HTML without writing custom CSS.'
    },
    {
        category: "UI Components",
        chosenStack: "shadcn/ui",
        logoImg: ShadcnUiLogoSvg,
        url: 'https://ui.shadcn.com',
        description: 'A collection of accessible, unstyled React components built with Tailwind CSS and Radix UI, intended to be copied and customized within a project.'
    },
    {
        category: "Router",
        chosenStack: "TanStack Router",
        logoImg: TanstackLogoPng,
        url: 'https://tanstack.com/router/latest',
        description: 'A type-safe, framework-agnostic routing library for managing navigation, data loading, and route-based state in JavaScript and TypeScript applications.'
    }
]