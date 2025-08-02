import CardDropTarget from '@/img/playing-cards/droptarget.svg'
import type { PlayingCanvasPosition, PlayingCardStackInfo } from './types'
import { PlayingCardsHooks } from './playing-cards-context'
import { type ComponentProps } from 'react'
import type { Immutable } from '@/lib/types'

export type PlayingCardDropTargetProps = Immutable<{
    stackInfo: PlayingCardStackInfo,
    position: PlayingCanvasPosition
}> & ComponentProps<'div'>
export function PlayingCardDropTarget({ stackInfo, position, ...props }: PlayingCardDropTargetProps) {
    const { dropTargetRef, isActivated, isDragOver } = PlayingCardsHooks.useDropTarget(stackInfo)

    return (
        <div
            {...props}
            ref={dropTargetRef}
            className={`absolute h-36 w-fit`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: stackInfo.cardIndex,
                opacity: (isActivated && isDragOver) ? 0.4 : 0,
                pointerEvents: isActivated ? 'auto' : 'none'
            }}
        >
            <img src={CardDropTarget} className="h-full" />
        </div>
    )
}