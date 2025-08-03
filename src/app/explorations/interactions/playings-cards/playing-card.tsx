import { useCallback, useEffect, useMemo, useState, type ComponentProps } from "react"
import type { PlayingCanvasPosition, PlayingCardStackData } from "./types"
import { PlayingCardsHooks } from "./playing-cards-context";
import type { Immutable } from "@/lib/types";
import { PlayingCardDropTarget } from "./playing-card-drop-target";

const STACKED_CARD_Y_OFFSET = 24 // px

export type PlayingCardProps = Immutable<{
    cardStack: PlayingCardStackData,
    cardIdx: number,
    position: PlayingCanvasPosition,
    isPreviousSiblingBeingDragged?: boolean
}> & ComponentProps<'div'>
export function PlayingCard({ cardStack, cardIdx, position, isPreviousSiblingBeingDragged, ...props }: PlayingCardProps) {
    // Track internal position separtely to allow for uncontrolled positioning while being dragged
    const [currentPosition, setCurrentPosition] = useState({
        x: position.x,
        y: position.y
    });

    const resetInternalPosition = useCallback(() => {
        setCurrentPosition(position)
    }, [position])
    const handleDrag = useCallback((canvasDeltaX: number, canvasDeltaY: number) => {
        setCurrentPosition(prev => ({
            x: prev.x + canvasDeltaX,
            y: prev.y + canvasDeltaY
        }))
    }, [])

    const { draggableRef, isBeingDragged } = PlayingCardsHooks.useDraggable(cardStack.cards[cardIdx], handleDrag, resetInternalPosition)

    // Reset the internal position if param changes
    useEffect(() => {
        resetInternalPosition()
    }, [position])

    const isInDraggedState = useMemo(() => isPreviousSiblingBeingDragged || isBeingDragged, [isPreviousSiblingBeingDragged, isBeingDragged])
    const nextSiblingPosition = useMemo<PlayingCanvasPosition>(() => ({ x: currentPosition.x, y: currentPosition.y + STACKED_CARD_Y_OFFSET }), [currentPosition])

    return (
        <>
            <div
                {...props}
                ref={draggableRef}
                className="absolute h-36"
                style={{
                    transform: `translateX(${currentPosition.x}px) translateY(${currentPosition.y}px)`,
                    zIndex: isInDraggedState ? cardIdx + 100 : cardIdx,
                    pointerEvents: isInDraggedState ? 'none' : 'auto'
                }}
            >
                <img src={cardStack.cards[cardIdx].descriptor.cardImg} className="h-full" draggable={false} />
            </div>
            <PlayingCardHolder
                cardStack={cardStack}
                cardIdx={cardIdx + 1}
                position={nextSiblingPosition}
                isPreviousSiblingBeingDragged={isInDraggedState}
            />
        </>
    )
}

export function PlayingCardHolder({ cardStack, cardIdx, position, isPreviousSiblingBeingDragged, ...props }: PlayingCardProps) {
    return (
        cardIdx < cardStack.cards.length ?
            <PlayingCard {...props} cardStack={cardStack} cardIdx={cardIdx} position={position} isPreviousSiblingBeingDragged={isPreviousSiblingBeingDragged} /> :
            (cardStack.hasDropTarget &&
                <PlayingCardDropTarget
                    stackInfo={{ stackId: cardStack.stackId, cardIndex: cardStack.cards.length }}
                    position={{ x: cardStack.position.x, y: cardStack.position.y + (cardStack.cards.length * STACKED_CARD_Y_OFFSET) }}
                />)
    )
}