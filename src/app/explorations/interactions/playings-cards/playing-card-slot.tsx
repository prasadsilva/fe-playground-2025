import { PlayingCard } from "./playing-card"
import type { PlayingCardData } from "./types"
import CardOutline from '@/img/playing-cards/outline.svg'

export interface PlayingCardSlotProps {
    initialCardData?: PlayingCardData,
    initialCanvasPosition: {
        x: number,
        y: number
    },
}
export function PlayingCardSlot({ initialCardData: initialCard, initialCanvasPosition }: PlayingCardSlotProps) {
    // Both slot and initial card(s) are created at the same level and under the canvas parent, to share the same coordinate system
    return (
        <>
            <div className={`absolute h-36 w-fit`} style={{ left: `${initialCanvasPosition.x}px`, top: `${initialCanvasPosition.y}px` }}>
                <img src={CardOutline} className="h-full" />
            </div>
            {
                initialCard && (
                    <PlayingCard name={`${initialCard.suit}.${initialCard.rank}`} data={initialCard} initialCanvasPosition={initialCanvasPosition} />
                )
            }
        </>
    )
}