import { useCallback, useEffect, useState, type PointerEvent } from "react"
import type { PlayingCanvasPosition, PlayingCardData } from "./types"
import { usePlayingCardsDragManager } from "./playing-cards-context";

export interface PlayingCardProps {
    card: PlayingCardData,
    position: PlayingCanvasPosition
}
export function PlayingCard({ card, position }: PlayingCardProps) {
    const [isBeingDragged, setIsBeingDragged] = useState(false)
    const [currentPosition, setCurrentPosition] = useState({
        x: position.x,
        y: position.y
    });
    const { setActiveDrag } = usePlayingCardsDragManager()

    const handlePointerCapture = useCallback((_e: PointerEvent) => {
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
            className="absolute h-36"
            style={{
                transform: `translateX(${currentPosition.x}px) translateY(${currentPosition.y}px)`,
                zIndex: isBeingDragged ? '100' : card.cardIndex
            }}
            onPointerDown={handlePointerCapture}
            draggable={false}
        >
            <img src={card.descriptor.cardImg} className="h-full" />
        </div>
    )
}