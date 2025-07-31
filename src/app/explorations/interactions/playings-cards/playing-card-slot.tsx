import { PlayingCard } from "./playing-card"
import type { PlayingCardData } from "./types"
import CardOutline from '@/img/playing-cards/outline.svg'

export interface PlayingCardSlotProps {
    initialCardData?: PlayingCardData,
    canvasPosition: {
        x: number,
        y: number
    },
}
export function PlayingCardSlot({ initialCardData: initialCard, canvasPosition }: PlayingCardSlotProps) {
    return (
        <>
            <div className={`absolute h-36 w-fit`} style={{ left: `${canvasPosition.x}px`, top: `${canvasPosition.y}px` }}>
                <img src={CardOutline} className="h-full" />
            </div>
            {
                initialCard && (
                    <PlayingCard name={`${initialCard.suit}.${initialCard.rank}`} data={initialCard} canvasPosition={canvasPosition} />
                )
            }
        </>
    )
}