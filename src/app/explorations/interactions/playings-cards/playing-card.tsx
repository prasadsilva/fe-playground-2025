import { useCallback, useState, type PointerEvent } from "react"
import type { PlayingCanvasPosition, PlayingCardData } from "./types"

export interface PlayingCardProps {
    card: PlayingCardData,
    position: PlayingCanvasPosition
}
export function PlayingCard({ card, position }: PlayingCardProps) {
    const [dragging, setDragging] = useState(false)
    const handlePointerCapture = useCallback((_e: PointerEvent) => {
        // TODO
    }, [])
    return (
        <div
            className="absolute h-36"
            style={{
                transform: `translateX(${position.x}px) translateY(${position.y}px)`,
                zIndex: dragging ? '100' : card.cardIndex
            }}
            onPointerDown={handlePointerCapture}
            draggable={false}
        >
            <img src={card.descriptor.cardImg} className="h-full" />
        </div>
    )
}