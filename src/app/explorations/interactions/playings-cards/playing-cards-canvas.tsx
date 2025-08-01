import type { ComponentProps } from "react"
import type { PlayingCardStackData } from "./types"
import { PlayingCardsStack } from "./playing-cards-stack"

export interface PlayingCardsCanvasProps extends ComponentProps<'div'> {
    cardStacks: PlayingCardStackData[]
}
export function PlayingCardsCanvas({ cardStacks }: PlayingCardsCanvasProps) {
    return (
        <div className="relative">
            {cardStacks.map((cardStack) => <PlayingCardsStack key={`card-stack-${cardStack.stackId}`} cardStack={cardStack} />)}
        </div >
    )
}