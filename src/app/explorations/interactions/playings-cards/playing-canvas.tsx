import { useEffect, useRef, useState, type JSX } from "react"
import { createNewDraggingContextValue, DraggingContext, type DraggingContextType } from "./dragging-context"

export type PlayingCanvasProps = {
    children: JSX.Element | JSX.Element[]
}
export function PlayingCanvas({ children }: PlayingCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const [draggingContextValue] = useState<InstanceType<DraggingContextType>>(createNewDraggingContextValue)
    useEffect(() => {
        draggingContextValue.registerCanvas(canvasRef)
        return () => draggingContextValue.unregisterCanvas(canvasRef)
    }, [])
    return (
        <DraggingContext value={draggingContextValue}>
            <div ref={canvasRef} className="relative">
                {children}
            </div>
        </DraggingContext>
    )
}