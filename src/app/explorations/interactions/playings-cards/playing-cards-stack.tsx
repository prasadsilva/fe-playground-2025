import type { ComponentProps } from "react"
import type { PlayingCardStackData } from "./types"
import { PlayingCardHolder } from "./playing-card"
import CardOutline from '@/img/playing-cards/outline.svg'
import type { Immutable } from "@/lib/types"

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
                <img src={CardOutline} className="w-[6rem] h-[9rem]" draggable={false} />
            </div>
            <PlayingCardHolder
                cardStack={cardStack}
                stackInfo={{ stackIndex, cardIndex: 0 }}
                position={cardStack.position}
            />
        </>
    )
}