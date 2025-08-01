import CardOutline from '@/img/playing-cards/outline.svg'
import type { PlayingCanvasPosition } from './types'

export interface PlayingCardDropTargetProps {
    representativeCardIdx: number,
    position: PlayingCanvasPosition
}
export function PlayingCardDropTarget({ representativeCardIdx, position }: PlayingCardDropTargetProps) {
    return (
        <div className={`absolute h-36 w-fit`} style={{ left: `${position.x}px`, top: `${position.y}px`, zIndex: representativeCardIdx, opacity: representativeCardIdx === 0 ? 1 : 0 }}>
            <img src={CardOutline} className="h-full" />
        </div>
    )
}