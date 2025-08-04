import CardDropTarget from '@/img/playing-cards/droptarget.svg?react'
import type { PlayingCanvasPosition, PlayingCardStackInfo } from './types'
import { PlayingCardsHooks } from './playing-cards-context'
import { type ComponentProps } from 'react'
import type { Immutable } from '@/lib/types'
import { cn } from '@/lib/utils'
import { CARD_DIMS_CLASS } from './data'

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
            className={`absolute size-fit`}
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: stackInfo.cardIndex,
                opacity: (isActivated && isDragOver) ? 1 : 0,
                pointerEvents: isActivated ? 'auto' : 'none'
            }}
        >
            <CardDropTarget className={cn("fill-gray-300 stroke-gray-900 opacity-30 dark:opacity-50", CARD_DIMS_CLASS)} />
        </div>
    )
}