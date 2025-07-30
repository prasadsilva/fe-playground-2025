import { PlayingCards } from '@/app/explorations/interactions/playings-cards/playing-cards'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/explorations/interactions/playing-cards')({
    component: PlayingCards,
})
