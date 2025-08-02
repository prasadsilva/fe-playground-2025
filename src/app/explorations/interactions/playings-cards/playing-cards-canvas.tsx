import { useEffect, type ComponentProps } from "react"
import { PlayingCardsStack } from "./playing-cards-stack"
import { usePlayingCardsModel } from "./playing-cards-context"
import type { Immutable } from "@/lib/types"

export type PlayingCardsCanvasProps = Immutable<{}> & ComponentProps<'div'>
export function PlayingCardsCanvas({ }: PlayingCardsCanvasProps) {
    const { cardStacks } = usePlayingCardsModel()
    return (
        <div className="relative">
            {cardStacks.map((cardStack) => <PlayingCardsStack key={`card-stack-${cardStack.stackId}`} cardStack={cardStack} />)}
        </div >
    )
}