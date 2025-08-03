import type { ComponentProps } from "react"
import type { PlayingCardStackData } from "./types"
import { PlayingCardHolder } from "./playing-card"
import CardOutline from '@/img/playing-cards/outline.svg'
import type { Immutable } from "@/lib/types"

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
            <PlayingCardHolder
                cardStack={cardStack}
                cardIdx={0}
                position={cardStack.position}
            />
        </>
    )
}