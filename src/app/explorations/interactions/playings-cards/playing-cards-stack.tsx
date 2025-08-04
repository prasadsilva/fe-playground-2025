import type { ComponentProps } from "react"
import type { PlayingCardStackData } from "./types"
import { PlayingCardHolder } from "./playing-card"
import CardOutline from '@/img/playing-cards/outline.svg?react'
import type { Immutable } from "@/lib/types"
import { CARD_DIMS_CLASS } from "./data"
import { cn } from "@/lib/utils"

export type PlayingCardsStackProps = Immutable<{
    cardStack: PlayingCardStackData,
    stackIndex: number
}> & ComponentProps<'div'>
export function PlayingCardsStack({ cardStack, stackIndex, ...props }: PlayingCardsStackProps) {
    return (
        <>
            <div
                {...props}
                className={`absolute size-fit`}
                style={{
                    left: `${cardStack.position.x}px`,
                    top: `${cardStack.position.y}px`,
                    zIndex: -10,
                    pointerEvents: 'none'
                }}>
                <CardOutline className={cn("stroke-gray-700 dark:stroke-gray-300", CARD_DIMS_CLASS)} />
            </div>
            <PlayingCardHolder
                cardStack={cardStack}
                stackInfo={{ stackIndex, cardIndex: 0 }}
                position={cardStack.position}
            />
        </>
    )
}