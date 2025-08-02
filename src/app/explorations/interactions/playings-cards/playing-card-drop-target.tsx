import CardDropTarget from '@/img/playing-cards/droptarget.svg'
import type { PlayingCanvasPosition, PlayingCardStackInfo } from './types'
import { usePlayingCardsDragManager } from './playing-cards-context'
import { useCallback, useEffect, useMemo, useState, type ComponentProps } from 'react'
import type { Immutable } from '@/lib/types'

export type PlayingCardDropTargetProps = Immutable<{
    stackInfo: PlayingCardStackInfo,
    position: PlayingCanvasPosition
}> & ComponentProps<'div'>
export function PlayingCardDropTarget({ stackInfo, position, ...props }: PlayingCardDropTargetProps) {
    const { activeDragCard, setActiveDrop, unsetActiveDrop } = usePlayingCardsDragManager()
    const [isDragCardOver, setIsDragCardOver] = useState(false)

    const isActivated = useMemo(() => activeDragCard && activeDragCard.stackInfo.stackId !== stackInfo.stackId, [activeDragCard])

    const handlePointerEnter = useCallback((_e: React.PointerEvent) => {
        if (isActivated) {
            setIsDragCardOver(true)
            setActiveDrop(stackInfo)
        }
    }, [activeDragCard])

    const handlePointerLeave = useCallback((_e: React.PointerEvent) => {
        if (isActivated) {
            setIsDragCardOver(false)
            unsetActiveDrop(stackInfo)
        }
    }, [activeDragCard])

    useEffect(() => {
        if (!activeDragCard) {
            setIsDragCardOver(false)
        }
    }, [activeDragCard])

    return (
        <div
            {...props}
            className={`absolute h-36 w-fit`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: stackInfo.cardIndex,
                opacity: (isActivated && isDragCardOver) ? 0.4 : 0,
                pointerEvents: isActivated ? 'auto' : 'none'
            }}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
        >
            <img src={CardDropTarget} className="h-full" />
        </div>
    )
}