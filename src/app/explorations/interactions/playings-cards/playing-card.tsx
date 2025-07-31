import { useCallback, useContext, useRef, useState } from "react";
import type { PlayingCardData } from "./types";
import { DraggingContext } from "./dragging-context";

export interface PlayingCardProps {
    name: string,
    data: PlayingCardData,
    canvasPosition: {
        x: number,
        y: number
    },
}
export function PlayingCard({ name, data, canvasPosition }: PlayingCardProps) {
    const objRef = useRef<HTMLDivElement>(null)
    const draggingContext = useContext(DraggingContext)
    const [translate, setTranslate] = useState({
        x: canvasPosition.x,
        y: canvasPosition.y
    });

    const registerPointerReleaseCallbacks = useCallback(() => {
        if (!objRef.current) return;
        const element = objRef.current;
        element.addEventListener('pointerup', handlePointerReleaseNative)
        element.addEventListener('pointerleave', handlePointerReleaseNative)
        element.addEventListener('pointercancel', handlePointerReleaseNative)
    }, [objRef])

    const unregisterPointerReleaseCallbacks = useCallback(() => {
        if (!objRef.current) return;
        const element = objRef.current;
        element.removeEventListener('pointerup', handlePointerReleaseNative)
        element.removeEventListener('pointerleave', handlePointerReleaseNative)
        element.removeEventListener('pointercancel', handlePointerReleaseNative)
    }, [objRef])

    const handlePointerCapture = useCallback((e: React.PointerEvent) => {
        console.log('handlePointerCapture')
        if (!objRef) return;
        registerPointerReleaseCallbacks()
        draggingContext.setDragObject(objRef, e.clientX, e.clientY, handleDrag)
    }, [objRef])

    const handlePointerReleaseNative = useCallback((_e: PointerEvent) => {
        console.log('handlePointerReleaseNative')
        unregisterPointerReleaseCallbacks()
        draggingContext.clearDragObject(objRef)
    }, [objRef])

    const handleDrag = useCallback((e: PointerEvent) => {
        console.log(`handleDrag called for ${name}`)
        setTranslate(prev => ({
            x: prev.x + e.movementX,
            y: prev.y + e.movementY
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