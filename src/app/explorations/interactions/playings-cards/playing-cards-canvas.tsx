import { type ComponentProps } from "react"
import { PlayingCardsStack } from "./playing-cards-stack"
import { PlayingCardsHooks } from "./playing-cards-context"
import type { Immutable } from "@/lib/types"

export type PlayingCardsCanvasProps = Immutable<{}> & ComponentProps<'div'>
export function PlayingCardsCanvas({ }: PlayingCardsCanvasProps) {
    const { cardStacks } = PlayingCardsHooks.useModel()
    return (
        <div className="relative">
            {cardStacks.map((cardStack) => <PlayingCardsStack key={`card-stack-${cardStack.stackId}`} cardStack={cardStack} />)}
        </div >
    )
}