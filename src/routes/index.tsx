import { AppIndex } from '@/app/app-index'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
    component: AppIndex,
})

