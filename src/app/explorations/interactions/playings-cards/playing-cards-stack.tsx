import type { ComponentProps } from "react"
import type { PlayingCardStackData } from "./types"
import { PlayingCard } from "./playing-card"
import { PlayingCardDropTarget } from "./playing-card-drop-target"

const STACKED_CARD_Y_OFFSET = 24 // px

export interface PlayingCardsStackProps extends ComponentProps<'div'> {
    cardStack: PlayingCardStackData
}
export function PlayingCardsStack({ cardStack }: PlayingCardsStackProps) {
    return (
        <>
            {
                cardStack.cards.map((card, idx) => <PlayingCard key={`card-${card.parentStackId}-${card.cardIndex}`} card={card} position={{ x: cardStack.position.x, y: cardStack.position.y + (idx * STACKED_CARD_Y_OFFSET) }} />)
            }
            {
                cardStack.hasDropTarget && <PlayingCardDropTarget representativeCardIdx={cardStack.cards.length} position={{ x: cardStack.position.x, y: cardStack.position.y + (cardStack.cards.length * STACKED_CARD_Y_OFFSET) }} />
            }
        </>
    )
}