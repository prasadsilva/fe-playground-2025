import { useCallback, useEffect, useState, type ComponentProps } from "react"
import type { PlayingCanvasPosition, PlayingCardData } from "./types"
import { PlayingCardsHooks } from "./playing-cards-context";
import type { Immutable } from "@/lib/types";

export type PlayingCardProps = Immutable<{
    card: PlayingCardData,
    position: PlayingCanvasPosition
}> & ComponentProps<'div'>
export function PlayingCard({ card, position, ...props }: PlayingCardProps) {
    // Track internal position separtely to allow for uncontrolled positioning while being dragged
    const [currentPosition, setCurrentPosition] = useState({
        x: position.x,
        y: position.y
    });
    const handleDrag = useCallback((canvasDeltaX: number, canvasDeltaY: number) => {
        setCurrentPosition(prev => ({
            x: prev.x + canvasDeltaX,
            y: prev.y + canvasDeltaY
        }))
    }, [])
    const { draggableRef, isBeingDragged } = PlayingCardsHooks.useDraggable(card, handleDrag)

    // Reset the internal position if param changes
    useEffect(() => {
        setCurrentPosition(position)
    }, [position])

    return (
        <div
            {...props}
            ref={draggableRef}
            className="absolute h-36"
            style={{
                transform: `translateX(${currentPosition.x}px) translateY(${currentPosition.y}px)`,
                zIndex: isBeingDragged ? '100' : card.stackInfo.cardIndex,
                pointerEvents: isBeingDragged ? 'none' : 'auto'
            }}
        >
            <img src={card.descriptor.cardImg} className="h-full" />
        </div>
    )
}