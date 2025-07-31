import { useCallback, useContext, useRef, useState } from "react";
import type { PlayingCardData } from "./types";
import { DraggingContext } from "./dragging-context";

export interface PlayingCardProps {
    name: string,
    data: PlayingCardData,
    initialCanvasPosition: {
        x: number,
        y: number
    },
}
export function PlayingCard({ name, data, initialCanvasPosition }: PlayingCardProps) {
    const objRef = useRef<HTMLDivElement>(null)
    const draggingContext = useContext(DraggingContext)
    const [translate, setTranslate] = useState({
        x: initialCanvasPosition.x,
        y: initialCanvasPosition.y
    });

    // TODO: Maybe all of this logic can be done in a useEffect by passing the ref to the context?
    //       dragginContext.registerDraggable(objRef)
    const handlePointerCapture = useCallback((_e: React.PointerEvent) => {
        if (!objRef || !objRef.current) return;
        draggingContext.setDragHandler(handleDrag)
    }, [objRef])

    const handleDrag = useCallback((canvasDeltaX: number, canvasDeltaY: number) => {
        setTranslate(prev => ({
            x: prev.x + canvasDeltaX,
            y: prev.y + canvasDeltaY
        }))
    }, [])

    return (
        <div
            id={name}
            ref={objRef}
            className="absolute h-36"
            style={{
                transform: `translateX(${translate.x}px) translateY(${translate.y}px)`
            }}
            onPointerDown={handlePointerCapture}
        >
            <img src={data.cardImg} className="h-full" />
        </div>
    )
}