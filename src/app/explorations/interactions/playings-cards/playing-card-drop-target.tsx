import CardDropTarget from '@/img/playing-cards/droptarget.svg'
import type { PlayingCanvasPosition } from './types'
import { usePlayingCardsDragManager } from './playing-cards-context'

export interface PlayingCardDropTargetProps {
    parentStackId: number,
    representativeCardIdx: number,
    position: PlayingCanvasPosition
}
export function PlayingCardDropTarget({ parentStackId, representativeCardIdx, position }: PlayingCardDropTargetProps) {
    const { activeDragCard } = usePlayingCardsDragManager()

    return (
        <div
            className={`absolute h-36 w-fit`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: representativeCardIdx,
                opacity: (activeDragCard && activeDragCard.parentStackId !== parentStackId) ? 0.2 : 0,
                pointerEvents: activeDragCard ? 'auto' : 'none'
            }}>
            <img src={CardDropTarget} className="h-full" />
        </div>
    )
}