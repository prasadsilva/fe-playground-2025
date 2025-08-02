import type { ComponentProps } from "react"
import type { PlayingCardStackData } from "./types"
import { PlayingCard } from "./playing-card"
import { PlayingCardDropTarget } from "./playing-card-drop-target"
import CardOutline from '@/img/playing-cards/outline.svg'
import type { Immutable } from "@/lib/types"

const STACKED_CARD_Y_OFFSET = 24 // px

export type PlayingCardsStackProps = Immutable<{
    cardStack: PlayingCardStackData
}> & ComponentProps<'div'>
export function PlayingCardsStack({ cardStack, ...props }: PlayingCardsStackProps) {
    return (
        <>
            <div
                {...props}
                className={`absolute h-36 w-fit`}
                style={{
                    left: `${cardStack.position.x}px`,
                    top: `${cardStack.position.y}px`,
                    zIndex: -10,
                    pointerEvents: 'none'
                }}>
                <img src={CardOutline} className="h-full" />
            </div>
            {
                cardStack.cards.map((card, idx) => (
                    <PlayingCard
                        key={`card${idx}-${card.stackInfo.stackId}-${card.stackInfo.cardIndex}`}
                        card={card}
                        position={{ x: cardStack.position.x, y: cardStack.position.y + (idx * STACKED_CARD_Y_OFFSET) }}
                    />)
                )
            }
            {
                cardStack.hasDropTarget &&
                <PlayingCardDropTarget
                    stackInfo={{ stackId: cardStack.stackId, cardIndex: cardStack.cards.length }}
                    position={{ x: cardStack.position.x, y: cardStack.position.y + (cardStack.cards.length * STACKED_CARD_Y_OFFSET) }}
                />
            }
        </>
    )
}