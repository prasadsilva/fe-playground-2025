import CardDropTarget from '@/img/playing-cards/droptarget.svg'
import type { PlayingCanvasPosition } from './types'
import { usePlayingCardsDragManager } from './playing-cards-context'
import { useCallback, useMemo, useState } from 'react'

export interface PlayingCardDropTargetProps {
    parentStackId: number,
    representativeCardIdx: number,
    position: PlayingCanvasPosition
}
export function PlayingCardDropTarget({ parentStackId, representativeCardIdx, position }: PlayingCardDropTargetProps) {
    const { activeDragCard } = usePlayingCardsDragManager()
    const [isDragCardOver, setIsDragCardOver] = useState(false)

    const isActivated = useMemo(() => activeDragCard && activeDragCard.parentStackId !== parentStackId, [activeDragCard])

    const handlePointerEnter = useCallback((_e: React.PointerEvent) => {
        if (isActivated) {
            console.log(`entering ${parentStackId} drop target`)
            setIsDragCardOver(true)
            // setActiveDrop(card, handleDrag, handleEndDrag)
        }
    }, [activeDragCard])

    const handlePointerLeave = useCallback((_e: React.PointerEvent) => {
        if (isActivated) {
            console.log(`leaving ${parentStackId} drop target`)
            setIsDragCardOver(false)
        }
    }, [activeDragCard])

    return (
        <div
            className={`absolute h-36 w-fit`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: representativeCardIdx,
                opacity: isDragCardOver ? 0.4 : 0,
                pointerEvents: isActivated ? 'auto' : 'none'
            }}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <img src={CardDropTarget} className="h-full" />
        </div>
    )
}