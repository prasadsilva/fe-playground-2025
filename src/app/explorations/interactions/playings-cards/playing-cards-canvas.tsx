import { type ComponentProps } from "react"
import { PlayingCardsStack } from "./playing-cards-stack"
import { PlayingCardsHooks } from "./playing-cards-context"
import type { Immutable } from "@/lib/types"

export type PlayingCardsCanvasProps = Immutable<{}> & ComponentProps<'div'>
export function PlayingCardsCanvas({ }: PlayingCardsCanvasProps) {
    const { canvasRef, isCanvasAvailable } = PlayingCardsHooks.useCanvas()
    const { cardStacks } = PlayingCardsHooks.useModel()

    return (
        <div ref={canvasRef} className="relative">
            {
                isCanvasAvailable &&
                cardStacks.map((cardStack, idx) => <PlayingCardsStack key={`card-stack-${idx}`} cardStack={cardStack} stackIndex={idx} />)
            }
        </div >
    )
}