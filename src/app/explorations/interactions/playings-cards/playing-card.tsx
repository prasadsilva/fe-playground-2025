import { useCallback, useEffect, useState, type ComponentProps, type PointerEvent } from "react"
import type { PlayingCanvasPosition, PlayingCardData } from "./types"
import { PlayingCardsHooks } from "./playing-cards-context";
import type { Immutable } from "@/lib/types";

export type PlayingCardProps = Immutable<{
    card: PlayingCardData,
    position: PlayingCanvasPosition
}> & ComponentProps<'div'>
export function PlayingCard({ card, position, ...props }: PlayingCardProps) {
    const [isBeingDragged, setIsBeingDragged] = useState(false)
    const [currentPosition, setCurrentPosition] = useState({
        x: position.x,
        y: position.y
    });
    const { setActiveDrag } = PlayingCardsHooks.useDragManager()

    // Reset the internal position if param changes
    useEffect(() => {
        setCurrentPosition(position)
    }, [position])

    const handlePointerDown = useCallback((_e: PointerEvent) => {
        setIsBeingDragged(true)
        setActiveDrag(card, handleDrag, handleEndDrag)
    }, [card])

    const handleDrag = useCallback((canvasDeltaX: number, canvasDeltaY: number) => {
        setCurrentPosition(prev => ({
            x: prev.x + canvasDeltaX,
            y: prev.y + canvasDeltaY
        }))
    }, [])

    const handleEndDrag = useCallback(() => {
        setIsBeingDragged(false)
    }, [])

    return (
        <div
            {...props}
            className="absolute h-36"
            style={{
                transform: `translateX(${currentPosition.x}px) translateY(${currentPosition.y}px)`,
                zIndex: isBeingDragged ? '100' : card.stackInfo.cardIndex,
                pointerEvents: isBeingDragged ? 'none' : 'auto'
            }}
            onPointerDown={handlePointerDown}
            draggable={false}
        >
            <img src={card.descriptor.cardImg} className="h-full" />
        </div>
    )
}